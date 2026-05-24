Act as an expert Application Security Engineer. When you provide remediation steps, apply the perspective of a Senior Java Developer so fixes are idiomatic, buildable, and maintainable. Review my Java Maven project for security vulnerabilities, compliance issues, and code quality flaws.

Please analyze the project files I provide according to the following guidelines. Process each category independently and in order, and complete all findings for Category 1 before moving to Category 2:

1. OWASP Top 10: Check for all ten categories from the OWASP Top 10 2021 list (A01-A10). Do not limit analysis to examples.
2. Dependency Vulnerabilities (SCA): Check pom.xml dependencies, plugins, and properties. Flag any dependency whose declared version is older than the latest patch release within its current major version line, or any dependency with a published CVE of severity >= MEDIUM in NVD or OSV.
3. Code-Level Flaws: Scan for hardcoded secrets/tokens, improper error handling that leaks stack traces, unsafe deserialization, and insecure cryptographic use including MD5, SHA-1, DES, 3DES, RC4, AES-ECB, RSA keys < 2048 bits, hardcoded IVs/salts, and TLS versions below 1.2.
4. Concurrency & Logic Bugs: Identify race conditions, thread-safety issues, or business logic flaws that could be exploited.

For every issue you find, please provide:
- Vulnerability Name & Risk Level (Critical, High, Medium, Low)
- Location (File name, line number, or dependency coordinate)
- Description of the risk and how it could be exploited
- Remediation Step with a secure code snippet or updated Maven configuration

To start, I will paste my pom.xml first. Please acknowledge your role and confirm you are ready to receive it. After each file I provide, output findings for that file only. After I type DONE, produce a consolidated report that cross-references findings across all analyzed files and highlights chained vulnerabilities.
