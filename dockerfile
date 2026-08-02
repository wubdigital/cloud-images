# --------- שלב 1: התקנות ובנייה ---------
FROM node:20-alpine AS builder
WORKDIR /app

# מעתיקים את קבצי ההגדרות ומתקינים הכל (גם חבילות פיתוח אם יש)
COPY package*.json ./
RUN npm install

# מעתיקים את שאר קוד המקור
COPY . .

# --------- שלב 2: סביבת הריצה (runner) ---------
FROM node:20-alpine AS runner
WORKDIR /app

# שואבים פנימה רק את התוצרים המוכנים משלב ה-builder, ומשנים בעלות למשתמש node
COPY --from=builder --chown=node:node /app/node_modules ./node_modules
COPY --from=builder --chown=node:node /app .

# מעבר רשמי למשתמש המאובטח והמוגבל
USER node

ENV NODE_ENV=production
EXPOSE 3000
CMD ["node", "app.js"]