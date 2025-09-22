# Taskflow

**Zarządzaj projektami jak profesjonalista!** Taskflow to nowoczesna aplikacja do zarządzania zadaniami w stylu Kanban, która pozwala tworzyć tablice projektowe, organizować zadania w kolumnach i śledzić postęp w czasie rzeczywistym. Idealna dla zespołów, freelancerów i każdego, kto chce uporządkować swoją pracę.

## 🚀 Technologie i architektura

Aplikacja została zbudowana z wykorzystaniem najnowszych technologii webowych, tworząc solidną i skalowalną architekturę:

- **Angular 20** - najnowsza wersja frameworka z pełnym wsparciem dla standalone components i nowoczesnych wzorców
- **TypeScript 5.8** - silne typowanie zapewniające bezpieczeństwo kodu i lepsze doświadczenie deweloperskie
- **Angular CDK** - komponenty i narzędzia do budowania dostępnych interfejsów użytkownika
- **RxJS** - reaktywne programowanie dla zarządzania stanem i asynchronicznych operacji
- **SCSS** - zaawansowane style z systemem designu i tematami (light/dark mode)
- **Playwright** - nowoczesne testy E2E z pełnym wsparciem dla różnych przeglądarek
- **ESLint + Prettier** - automatyczne formatowanie i linting kodu
- **Husky + lint-staged** - pre-commit hooks zapewniające jakość kodu

### Architektura aplikacji

Aplikacja wykorzystuje **feature-based architecture** z podziałem na:

- **Core** - serwisy globalne, guardy, interceptory i komponenty wspólne
- **Features** - moduły funkcjonalne (auth, board, task, column, user)
- **Shared** - komponenty UI, dyrektywy, pipe'y i utilities
- **Standalone components** - nowoczesne podejście Angular bez NgModules

Stan aplikacji jest zarządzany przez **reaktywne serwisy** z wykorzystaniem RxJS, zapewniając spójność danych i optymalną wydajność.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
