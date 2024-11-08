const assert = require('assert');
const fs = require('fs');
const { execSync } = require('child_process');

describe("Config Language Parser Tests", function() {
    // Тестовые файлы для каждой конструкции
    const testFiles = {
        constants: 'test_constants.txt',
        arrays: 'test_arrays.txt',
        dictionaries: 'test_dictionaries.txt',
        expressions: 'test_expressions.txt',
        nestedStructures: 'test_nested_structures.txt',
    };

    // Общая функция для запуска тестов с файлом конфигурации
    function runConfigTest(inputFile, expectedOutput) {
        fs.writeFileSync('input_test.txt', inputFile);
        execSync('node index.js input_test.txt output_test.toml');
        const result = JSON.parse(fs.readFileSync('output_test.toml', 'utf-8'));
        assert.deepStrictEqual(result, expectedOutput);
    }

    it("Тест констант", function() {
        const input = `
            (define max_connections 100);
            (define timeout 300);
            server_config $[
                max_connections: max_connections,
                timeout: timeout
            ]
        `;
        const expectedOutput = {
            server_config: {
                max_connections: 100,
                timeout: 300
            }
        };
        runConfigTest(input, expectedOutput);
    });

    it("Тест массивов", function() {
        const input = `
            allowed_ips (list "192.168.1.1" "192.168.1.2" "10.0.0.1")
            user_roles (list "admin" "user" "guest")
        `;
        const expectedOutput = {
            allowed_ips: ["192.168.1.1", "192.168.1.2", "10.0.0.1"],
            user_roles: ["admin", "user", "guest"]
        };
        runConfigTest(input, expectedOutput);
    });

    it("Тест словарей", function() {
        const input = `
            network_settings $[
                primary_dns: "8.8.8.8",
                secondary_dns: "8.8.4.4",
                max_sessions: 5,
                session_timeout: 300
            ]
        `;
        const expectedOutput = {
            network_settings: {
                primary_dns: "8.8.8.8",
                secondary_dns: "8.8.4.4",
                max_sessions: 5,
                session_timeout: 300
            }
        };
        runConfigTest(input, expectedOutput);
    });

    it("Тест выражений", function() {
        const input = `
            (define base_timeout 100);
            (define retry_count 3);
            server_config $[
                timeout: @{+ base_timeout 50},
                max_retries: @{* retry_count 2}
            ]
        `;
        const expectedOutput = {
            server_config: {
                timeout: 150,
                max_retries: 6
            }
        };
        runConfigTest(input, expectedOutput);
    });
});
