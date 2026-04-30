# MobiShop Maintenance

MobiShop Maintenance is a modern, high-performance desktop application designed for repair shop owners to manage their daily operations efficiently. Built with **Tauri v2**, **React**, and **Rust**, it offers a lightweight and secure solution for tracking repairs, managing customers, and generating professional receipts.

## Features

- **Comprehensive Dashboard:** Real-time statistics on today's repairs, monthly totals, revenue, and net profit.
- **Smart Repair Forms:** Quickly add new repairs with dynamic brand selection for Phones, Laptops, and Tablets.
- **Advanced Search & Filter:** Instantly find repairs by ID, customer name, or phone number. Filter by status (Pending, In Progress, Ready, Delivered).
- **Thermal Printing:** Automatic generation of professional receipts and device stickers optimized for 80mm thermal printers.
- **Internationalization (i18n):** Full support for English and Arabic with a seamless Right-to-Left (RTL) interface toggle.
- **Local Database:** All data is stored locally using SQLite, ensuring speed and data privacy.
- **Dark Mode Ready:** Sleek design with full support for dark and light modes.
- **Automated Releases:** GitHub Actions integrated for automatic builds and releases (Windows, macOS, Linux).

## Tech Stack

- **Framework:** [Tauri v2](https://v2.tauri.app/) (Desktop Bridge)
- **Frontend:** [React](https://reactjs.org/) + [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
- **State Management:** [Zustand](https://github.com/pmndrs/zustand)
- **Backend:** [Rust](https://www.rust-lang.org/)
- **Database:** [SQLite](https://www.sqlite.org/) (via [rusqlite](https://github.com/rusqlite/rusqlite))
- **Translations:** [i18next](https://www.i18next.com/)

## 🚀 Getting Started

### Prerequisites

- [Rust](https://www.rust-lang.org/tools/install)
- [Node.js](https://nodejs.org/) (v18+)
- [Tauri Prerequisites](https://v2.tauri.app/start/prerequisites/)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/logiccrafterdz/MobiShop-Maintenance.git
   cd MobiShop-Maintenance
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run in development mode:
   ```bash
   npm run tauri dev
   ```

### Building for Production

To build a standalone executable for your current OS:
```bash
npm run tauri build
```

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

Developed with ❤️ for MobiShop.
