# Cloud Images Project - Automated CI/CD to AWS ECS

## 🏗️ Architecture Overview

```text
      GitHub
        |
        ▼
   GitHub Actions
        |
        ▼
       ECR
        |
        ▼
  User ---> ALB ---> ECS Fargate
                       |       |
                    Task 1   Task 2
                       |       |
                       +-------+
                           |
                           ▼
                          S3


## System Documentation
1. איך המערכת בנויה?
המערכת מריצה אפליקציית Web מבוססת Node.js המאפשרת העלאת קבצים ישירות ל-AWS S3. האפליקציה עטופה בקונטיינר Docker ורצה על גבי תשתיות הענן של אמזון.

2. באילו שירותי AWS השתמשנו?
Amazon ECR (Elastic Container Registry): לשמירת ה-Docker Images של הפרויקט.

Amazon ECS (Elastic Container Service - Fargate): להרצת הקונטיינרים בסביבת Serverless ללא ניהול שרתים, עם הגדרת Service המריץ מספר Tasks במקביל.

ALB (Application Load Balancer): לניתוב התעבורה מהמשתמשים אל ה-Tasks של ה-ECS בצורה מאוזנת ותומכת ב-Zero-Downtime.

Amazon S3: לאחסון המסמכים והקבצים שהמשתמשים מעלים דרך האפליקציה.

3. איך ה-CI/CD עובד?
התהליך מנוהל אוטומטית על ידי GitHub Actions ברגע שמבצעים git push לבראנץ' ה-main:

Checkout & Auth: שליפת הקוד מהריפו ואימות מול AWS בעזרת סודות הצפנה (Secrets).

Build & Push: בניית אימג' ה-Docker חדש ושליחתו ל-Amazon ECR.

ECS Deployment: שליפת ה-Task Definition הקיים מ-AWS, עדכון תגית האימג' החדשה באמצעות פקודות CLI ישירות, רישום גרסת Task חדשה ועדכון ה-Service של ה-ECS תוך המתנה להתייצבות (Zero-Downtime).

4. איך טיפלנו בהרשאות?
ההרשאות והגישה לשירותי AWS מנוהלות בצורה מאובטחת באמצעות GitHub Actions Secrets (AWS_ACCESS_KEY_ID ו-AWS_SECRET_ACCESS_KEY), המאפשרים ל-Pipeline להתחבר לחשבון ה-AWS לבצע Push ל-ECR ולעדכן את ה-ECS מבלי לחשוף מפתחות בקוד המקור.

5. בעיה שנתקלנו בה ואיך פתרנו אותה?
הבעיה: בזמן הפעלת ה-Deployment דרך ה-GitHub Actions, קיבלנו שגיאה עקשנית מצד ה-AWS SDK הישן: Unexpected key 'enableFaultInjection' found in params, מה שמנע רישום של ה-Task Definition מחדש.

הפתרון: עקפנו את ה-Actions החיצוניים המיושנים ובמקום זאת ביצענו את תהליך ה-Deployment בעזרת סקריפט מבוסס AWS CLI ו-jq ישירות ב-Runner. הסקריפט מוריד את ה-Task Definition הקיים, מנקה ממנו שדות מערכת מיושנים/אסורים, מעדכן את האימג' החדש ומעדכן את ה-Service בצורה חלקה ויציבה.
```
