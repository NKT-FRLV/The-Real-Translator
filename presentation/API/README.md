# API Module

Этот модуль содержит все API функции для взаимодействия с сервером.

## Структура

```
presentation/API/
├── client.ts          # Общий API клиент с axios
├── like/              # API для работы с лайками
│   ├── likeApi.ts     # Функции для лайков
│   └── index.ts       # Экспорты
├── translate/         # API для переводов
├── history/          # API для истории
├── warmer/           # API для прогрева соединений
└── README.md         # Эта документация
```

## Использование

### Общий API клиент

```typescript
import { apiClient } from "@/presentation/API/client";

// Использование в API функциях
const response = await apiClient.post("/endpoint", data);
```

### API для лайков

```typescript
import { likeTranslation } from "@/presentation/API/like";

const result = await likeTranslation(translationId, true);
if (result.success) {
  // Обработка успеха
} else {
  // Обработка ошибки
  console.error(result.error);
}
```

## Принципы

1. **Типизация**: Все API функции типизированы
2. **Обработка ошибок**: Централизованная обработка ошибок
3. **Переиспользование**: Общий клиент для всех запросов
4. **Разделение ответственности**: Каждый модуль отвечает за свою область
