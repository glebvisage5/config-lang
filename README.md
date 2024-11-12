# config-lang

Добро пожаловать в проект! Здесь находится командной строки для учебного конфигурационного языка. Этот инструмент преобразует текст из входного формата в выходной. Основная информация и инструкции помогут вам быстро начать работу.

## Оглавление

- [Особенности](#особенности)
- [Установка](#установка)
- [Использование](#использование)
- [Структура проекта](#структура-проекта)
- [Запуск тестов](#запуск-тестов)
- [Контакты](#контакты)

## Особенности

- 📜 **Обработка конфигураций** — поддержка констант, словарей, массивов и выражений
- 🛠️ **Простота в использовании** — легкость запуска и работы с конфигурационными файлами
- 📈 **Расширяемость** — можно добавлять новые типы конфигураций и выражений

## Установка

1. Клонируйте репозиторий:
   ```bash
   git clone -b master https://github.com/glebvisage5/config-lang.git
2. Перейдите в папку проекта:
   ```bash
   cd имя_репозитория
3. Установите зависимости, если у вас не удалось скачать папку node_modules:
   ```bash
   npm install fs mocha child_process assert

## Использование

### Запуск инструмента

Для запуска используйте следующую команду:
```bash
node index.js input.txt output.toml
```
Где index.js - основной файл с кодом, input.txt - файл с конфигурациями, output.toml - выходной файл на другом языке

### Пример использования

1. Настройте файл **`input.txt`**, он может содеражать:
   ```bash
    # Определение констант
    (define max_sessions 5);
    (define timeout 300);
    # Настройки сети
    network_config $[
    primary_dns: "8.8.8.8",
    secondary_dns: "8.8.4.4",
    max_sessions: max_sessions,
    session_timeout: timeout
    ]
    # Разрешенные IP-адреса
    allowed_ips (list "192.168.1.1" "192.168.1.2" "10.0.0.1")
  ```

2. Запустите команду для генерации графа и визуализации:
```bash
node index.js input.txt output.toml
```
После выполнения команда сгенерирует файл `.toml` и создаст конфигурационный код, написанный на другом языке.

3. Ожидаемый результат:
   ```bash
    {
    "network_config": {
    "primary_dns": "8.8.8.8",
    "secondary_dns": "8.8.4.4",
    "max_sessions": 5,
    "session_timeout": 300
    },
    "allowed_ips": ["192.168.1.1", "192.168.1.2", "10.0.0.1"]
    }```

## 🗂️ Структура проекта

- 🟦 **`index.js`** — основной скрипт проекта, содержащий логику парсинга конфигурационного языка
- 📝 **`input.txt`** — пример входного файла конфигурации для тестирования
- 📂 **`output.toml`** — выходной файл, в который сохраняется результат парсинга
- 🧪 **`test.js`** — тесты для проверки корректности работы кода

## Запуск тестов

Для запуска тестов  функции требуется выполнить команду в терминале:
```bash
npm test
```

## Скриншот тестов
![image](https://github.com/user-attachments/assets/acca8c38-2735-4298-a539-17c1b568140b)

## Результаты трех примеров описания конфигураций
1. При запуске input_test1.txt
```bash
{
  "server_config": {
    "server_name": "example.com",
    "listen_port": 80,
    "max_clients": 200,
    "timeout": 400,
    "enable_ssl": "true"
  },
  "ssl_config": {
    "cert_file": "/etc/ssl/certs/server.crt",
    "key_file": "/etc/ssl/private/server.key",
    "ssl_protocol": "TLSv1.2"
  },
  "cache_config": {
    "enabled": "true",
    "cache_size": 4096,
    "cache_timeout": 600
  }
}
```
2. При запуске input_test2.txt
```bash
{
  "data_processor": {
    "batch_size": 1000,
    "threads": 4,
    "max_memory": 2048,
    "log_level": "debug"
  },
  "input_data": {
    "data_source": "database",
    "db_host": "db.example.com",
    "db_port": 5432,
    "retry_attempts": 1005
  },
  "output_settings": {
    "output_format": "JSON",
    "output_path": "/data/output",
    "max_file_size": 1024
  }
}
```
3. При запуске input_test3.txt
```bash
{
  "network_settings": {
    "primary_dns": "8.8.8.8",
    "secondary_dns": "8.8.4.4",
    "max_sessions": 5,
    "session_timeout": 15
  },
  "vpn_settings": {
    "server_address": "vpn.corp.com",
    "port": 1194,
    "encryption_level": 256,
    "allow_split_tunneling": "false"
  },
  "access_groups": [
    "Admin",
    "User",
    "Guest"
  ],
  "security_policies": {
    "enforce_2fa": "true",
    "lockout_threshold": 10
  },
  "password_policy:": {
    "min_length": 12,
    "require_special": "true"
  }
}
```

## Контакты
Если у вас возникли вопросы или предложения, свяжитесь со мной:
   - 📧 [Telegram](https://t.me/Visage2)
