const fs = require('fs');

// Функция для обработки синтаксических ошибок
function throwError(message) {
  console.error(`Ошибка: ${message}`);
  process.exit(1);
}

// Читаем аргументы командной строки
const args = process.argv.slice(2);
const inputPath = args[0];
const outputPath = args[1];

if (!inputPath || !outputPath) {
  throwError("Укажите путь к входному и выходному файлам");
}

// Читаем входной файл
const inputText = fs.readFileSync(inputPath, 'utf-8');
const lines = inputText.split('\n');

// Переменные для хранения данных
let constants = {}; // Словарь для хранения констант
let result = {}; // Объект для сохранения результата
let isParsingDictionary = false; // Флаг для отслеживания, обрабатывается ли словарь
let currentDictName = ''; // Имя текущего словаря
let currentDictContent = ''; // Содержимое текущего словаря

// Функция для обработки строк
function parseLine(line) {
  line = line.trim(); // Удаляем лишние пробелы в начале и конце строки

  if (line.startsWith("#") || line === "") return; // Игнорируем комментарии и пустые строки
  
  // Обработка объявления константы
  if (line.startsWith("(define ")) {
    const [name, value] = line.slice(8, -2).split(" "); // Извлекаем имя и значение константы
    constants[name] = Number(value); // Сохраняем значение как число в объекте constants
    return;
  }

  // Обработка именованного массива
  if (line.includes('(list ') && line.endsWith(')')) {
    const arrayName = line.split('(list ')[0].trim(); // Извлекаем имя массива
    const items = line.slice(line.indexOf('(list ') + 6, -1).split(" ").filter(item => item !== ''); // Извлекаем элементы массива
    result[arrayName] = items.map(item => item.startsWith('"') && item.endsWith('"') ? item.slice(1, -1) : item); // Добавляем элементы массива в result, удаляя кавычки
    return;
  }

  // Обработка начала словаря
  if (line.includes('$[') && !isParsingDictionary) {
    isParsingDictionary = true; // Устанавливаем флаг начала обработки словаря
    currentDictName = line.split('$[')[0].trim(); // Извлекаем имя словаря
    currentDictContent = line.slice(line.indexOf('$[') + 2).trim(); // Извлекаем начальное содержимое словаря
    return;
  }

  // Обработка содержимого словаря
  if (isParsingDictionary) {
    // Проверка завершения словаря
    if (line.endsWith(']')) {
      isParsingDictionary = false; // Сбрасываем флаг завершения словаря
      currentDictContent += ' ' + line.slice(0, -1).trim(); // Добавляем последнюю строку без "]"
      processDictionary(currentDictName, currentDictContent); // Обрабатываем словарь
      currentDictName = ''; // Сбрасываем текущее имя словаря
      currentDictContent = ''; // Сбрасываем текущее содержимое словаря
    } else {
      // Добавляем строки, пока не встретим ']'
      currentDictContent += ' ' + line;
    }
    return;
  }

  throwError(`Неизвестная конструкция: ${line}`); // Выводим ошибку, если конструкция не распознана
}

// Функция для обработки содержимого словаря
function processDictionary(dictName, dictContent) {
  // Удаляем комментарии внутри словаря, удаляя все, что идет после #
  dictContent = dictContent.replace(/#.*$/gm, '').trim(); // Убираем комментарии и лишние пробелы

  const dict = {};
  console.log(`Разбор словаря: ${dictName}`); // Отладочное сообщение
  console.log(`Содержимое словаря: ${dictContent}`); // Отладочное сообщение

  // Разбиваем содержимое на пары ключ-значение, игнорируя пустые строки
  const pairs = dictContent.split(',').map(pair => pair.trim()).filter(pair => pair.length > 0);
  
  pairs.forEach(pair => {
    let [key, value] = pair.split(':').map(s => s.trim());

    console.log(`Обработка пары: ключ="${key}", значение="${value}"`); // Отладочное сообщение

    // Проверяем, что ключ и значение существуют
    if (!key || value === undefined) {
      throwError(`Неправильный формат пары ключ-значение: ${pair}`);
    }

    // Проверка и обработка различных типов значений
    if (value.startsWith('@{') && value.endsWith('}')) {
      value = evaluateExpression(value.slice(2, -1).trim()); // Вычисляем выражение
    } else if (constants[value] !== undefined) {
      value = constants[value]; // Используем значение константы
    } else if (value.startsWith('"') && value.endsWith('"')) {
      value = value.slice(1, -1); // Убираем кавычки для строкового значения
    } else if (!isNaN(Number(value))) {
      value = Number(value); // Преобразуем в число, если это число
    }

    dict[key] = value; // Добавляем пару ключ-значение в словарь
  });

  result[dictName] = dict; // Сохраняем словарь в result
}

// Функция для вычисления выражений
function evaluateExpression(expression) {
  const tokens = expression.split(" "); // Разделяем выражение на токены
  const operator = tokens[0]; // Первый токен — оператор
  const operands = tokens.slice(1).map(token => {
    return constants[token] !== undefined ? constants[token] : Number(token); // Заменяем константы или преобразуем в число
  });

  // Выполняем операцию в зависимости от оператора
  switch (operator) {
    case '+': return operands.reduce((a, b) => a + b, 0);
    case '-': return operands.reduce((a, b) => a - b);
    case '*': return operands.reduce((a, b) => a * b, 1);
    case '/': return operands.reduce((a, b) => a / b);
    case 'abs': return Math.abs(operands[0]);
    default: throwError(`Неизвестная операция: ${operator}`); // Ошибка, если оператор неизвестен
  }
}

// Обработка каждой строки входного файла
lines.forEach(line => {
  parseLine(line); // Обрабатываем каждую строку
});

// Запись в файл
const tomlString = JSON.stringify(result, null, 2); // Преобразуем объект result в формат JSON
fs.writeFileSync(outputPath, tomlString, 'utf-8'); // Записываем результат в выходной файл
console.log("Конфигурация успешно сохранена в", outputPath); // Выводим сообщение об успешной записи
