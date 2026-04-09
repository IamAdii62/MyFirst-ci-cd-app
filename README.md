# CI/CD Pipeline Project (Node.js + Docker + AWS EC2)

## Project Overview

This project demonstrates a complete CI/CD pipeline where a Node.js application is automatically built, containerized, and deployed to an AWS EC2 instance using GitHub Actions.

The main goal was to understand the full workflow from local development to live deployment.

---

## Step 1: Local Development (Node.js)

A simple Node.js application was created and tested locally.

### app.js

```js
const express = require("express");
const app = express();

app.get("/", (req, res) => {
  res.send("CI/CD SUCCESS");
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
```

### Commands used

```bash
npm init -y
npm install express
node app.js
```

Application tested on:
http://localhost:3000

![alt text](<Screenshot 2026-04-09 171714.png>)

---

## Step 2: Docker Setup

The application was containerized using Docker.

### Dockerfile

```dockerfile
FROM node:18

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3000

CMD ["node", "app.js"]
```

### Commands used

```bash
docker build -t ci-cd-app .
docker run -d -p 3000:3000 ci-cd-app
```
![alt text](image.png)
---

## Step 3: Docker Hub

Docker image was pushed to Docker Hub repository.

### Commands used

```bash
docker login
docker tag ci-cd-app aditi62/myfirstcicd
docker push aditi62/myfirstcicd
```
![alt text](image-2.png)

![alt text](image-1.png)

---

## Step 4: AWS EC2 Setup

An Ubuntu EC2 instance was launched and Docker was installed.

### Commands used

```bash
sudo apt update
sudo apt install docker.io -y
sudo systemctl start docker
```

Image pulled and container started:

```bash
docker pull aditi62/myfirstcicd
docker run -d -p 3000:3000 --name app aditi62/myfirstcicd
```

![alt text](image-4.png)
![alt text](image-5.png)
![alt text](<Screenshot 2026-04-09 172410.png>)


---

## Step 5: GitHub Repository

Project code was pushed to GitHub.

### Commands used

```bash
git init
git add .
git commit -m "initial commit"
git branch -M main
git remote add origin <repo-url>
git push -u origin main
```

![alt text](image-6.png)
![alt text](image-7.png)

---

## Step 6: CI/CD Pipeline (GitHub Actions)

A workflow was created to automate build and deployment.

### File: .github/workflows/deploy.yml

```yaml
name: CI/CD Pipeline

on:
  push:
    branches:
      - main

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
    - name: Checkout code
      uses: actions/checkout@v3

    - name: Login Docker Hub
      run: echo "${{ secrets.DOCKER_PASSWORD }}" | docker login -u "${{ secrets.DOCKER_USERNAME }}" --password-stdin

    - name: Build Docker Image
      run: docker build -t aditi62/myfirstcicd .

    - name: Push Docker Image
      run: docker push aditi62/myfirstcicd

    - name: Deploy to EC2
      uses: appleboy/ssh-action@master
      with:
        host: ${{ secrets.EC2_HOST }}
        username: ${{ secrets.EC2_USER }}
        key: ${{ secrets.EC2_SSH_KEY }}
        script: |
          docker stop app || true
          docker rm app || true
          docker pull aditi62/myfirstcicd
          docker run -d -p 3000:3000 --name app aditi62/myfirstcicd
```

---

## Step 7: Pipeline Execution

After pushing changes:

```bash
git add .
git commit -m "update"
git push
```

GitHub Actions automatically:

* Builds Docker image
* Pushes to Docker Hub
* Deploys to EC2

![alt text](<Screenshot 2026-04-09 172306.png>)
![alt text](<Screenshot 2026-04-09 171651-1.png>)
---

## Final Output

Application is live at:
http://<EC2-PUBLIC-IP>:3000



---

## Project Structure

```
ci-cd-app/
├── app.js
├── package.json
├── Dockerfile
├── test.js
└── .github/workflows/deploy.yml
```

---

## Key Learnings

* CI/CD pipeline implementation
* Docker containerization
* AWS EC2 deployment
* GitHub Actions automation
* End-to-end DevOps workflow

---
