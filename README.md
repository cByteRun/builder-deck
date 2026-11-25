# Builder Deck

На главной странице опубликован Proof of Work Hub Даниила Ткачёва с кейсами, AI-досье и достижениями на английском, русском и казахском. Для личной новой вкладки задайте в New Tab Override адрес `https://builder-deck.vercel.app/#workspace`. Нижняя панель переключает портфолио, Trophy Shelf и Workspace. Командная палитра открывается по Ctrl+K или Cmd+K и связывает разделы, проекты, сертификаты и профили.

## Разработка

```sh
npm ci
npm run lint
npm run typecheck
npm run build
python3 -m http.server 8080 --directory dist --bind 127.0.0.1
```

Используйте Node.js 20 или новее. Сайт состоит из статических ES-модулей, CSS и локальных SVG и шрифтов. Параметры сборки Vercel находятся в `vercel.json`.

## Структура

- `src/components/` — маскот, поиск, стикеры, трофеи и быстрые ссылки.
- `src/data/` — маршруты поиска и достижения.
- `src/portfolio/` — кейсы, переводы, досье, лента и командная палитра. Английская главная также рендерится при сборке.
- `assets/portfolio/` — иллюстрации продуктов и наклейки из [исходного Proof of Work Hub](https://github.com/cByteRun/proof-of-work-hub/tree/cfa37429c9d8e0fbf9f802093b46b91c925bcbce).
- `src/themes/` — токены и компоненты Claude Code, Vibe Coding V1 и Vibe Coding V2.
- `src/styles/` — общая компоновка, шрифты и покадровая анимация.
- `assets/` — графика, шрифты и стили профиля Firefox.

Тема и позиции стикеров сохраняются в localStorage текущего сайта. Workspace использует исходные ключи Hybrid. Перетаскивайте стикеры мышью или перемещайте стрелками при фокусе. Двойной щелчок или клавиша R поворачивают стикер.
