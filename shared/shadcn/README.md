# Shadcn/UI Components

Все shadcn/ui компоненты размещены в папке `shared/shadcn/`.

## Структура

```
shared/shadcn/
├── ui/           # UI компоненты
├── utils.ts      # Утилитарные функции (cn)
└── index.ts      # Главный экспорт
```

## Способы импорта

### 1. Импорт конкретного компонента
```typescript
import { Button } from '@/shared/shadcn/ui/button';
import { Input } from '@/shared/shadcn/ui/input';
```

### 2. Импорт через ui алиас
```typescript
import { Button } from '@/ui/button';
import { Input } from '@/ui/input';
```

### 3. Импорт через главный index файл
```typescript
import { Button, Input, cn } from '@/shared/shadcn';
```

### 4. Импорт утилит
```typescript
import { cn } from '@/shared/shadcn/utils';
// или
import { cn } from '@/shared/shadcn';
```

## Установка новых компонентов

При установке новых компонентов shadcn они автоматически будут размещены в правильной папке:

```bash
npx shadcn@latest add [component-name]
```

Не забудьте добавить новый компонент в `shared/shadcn/ui/index.ts` для удобного импорта. 