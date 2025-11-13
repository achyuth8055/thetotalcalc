# TheTotalCalc - Universal Calculator Hub

TheTotalCalc is a comprehensive web application offering 30+ free calculators across Finance, Math, Health, Date & Time, Everyday, and Developer categories. Built with Next.js 14, TypeScript, and Tailwind CSS.

## 🚀 Features

- **Finance Calculators**: EMI, SIP, FD, Home Loan, Car Loan, Brokerage, Margin, SWP
- **Health Calculators**: BMI, BMR, Calorie, Ideal Weight with interactive sliders
- **Math Calculators**: Percentage, GPA, Grade, Ratio, Average, Scientific Calculator, Math Quiz for Kids
- **Date & Time Calculators**: Age, Countdown, Date Difference, Add/Subtract Days
- **Everyday Calculators**: Tip, Discount, Split Bill, Unit Converter
- **Developer Tools**: Binary, Hex, ASCII, Base64, Color Converters

### Key Highlights

✅ **30+ Calculators** - Comprehensive coverage of daily calculation needs  
✅ **Automatic Currency Detection** - IP-based currency selection for finance tools  
✅ **AI-Powered Math Quiz** - Groq API integration for dynamic question generation  
✅ **Mobile Responsive** - Optimized for all devices  
✅ **No Registration Required** - Instant access to all features  
✅ **Interactive Visualizations** - Charts and graphs for better understanding  
✅ **SEO Optimized** - Complete metadata and JSON-LD structured data  
✅ **Retro Calculator Font** - Custom "Pocket Calculator" styling  

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **AI Integration**: Groq SDK (llama-3.3-70b-versatile)
- **Charts**: Recharts
- **Animations**: canvas-confetti
- **Icons**: react-icons

## 📦 Installation

\`\`\`bash
# Install dependencies
npm install

# Set up environment variables
# Create .env.local file with:
# GROQ_API_KEY=your_groq_api_key_here

# Run development server
npm run dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) to view the application.

## 🚀 Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import project to Vercel
3. Add environment variable: \`GROQ_API_KEY\`
4. Deploy

### Build for Production

\`\`\`bash
npm run build
npm start
\`\`\`

## 🔑 Environment Variables

Create a \`.env.local\` file:

\`\`\`env
GROQ_API_KEY=your_groq_api_key_here
\`\`\`

## 📄 License

MIT License

---

Made with ❤️ by TheTotalCalc Team
