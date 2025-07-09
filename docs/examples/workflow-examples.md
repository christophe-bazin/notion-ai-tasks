# Workflow Examples - notion-ai-tasks

## Complete Development Workflow

### **Step 1: Take a task**
```bash
# Voir les tâches disponibles
node cli.js list

# Examiner une tâche spécifique
node cli.js show abc123
```

### **Step 2: Create branch and start**
```bash
# Créer une branche feature
git checkout -b feature/implement-user-auth

# Mettre à jour le statut dans Notion
node cli.js update abc123 --status "In Progress"
```

### **Step 3: Iterative development**
```bash
# Ajouter des todos pendant le développement
node cli.js todo abc123 "Créer le modèle utilisateur" true
node cli.js todo abc123 "Implémenter l'authentification JWT" true
node cli.js todo abc123 "Ajouter les tests unitaires" true

# Mettre à jour le contenu avec les détails
node cli.js add-content abc123 --content "## Implémentation
- Utiliser bcrypt pour le hachage
- JWT avec expiration 24h
- Middleware d'authentification"
```

### **Step 4: Finalization**
```bash
# Commits et push
git add .
git commit -m "feat: implement user authentication system"
git push origin feature/implement-user-auth

# Créer PR vers main
# Après merge, la tâche passera automatiquement en "Test"
```

## Natural Language Workflow

### **Creating tasks in French:**
```bash
# Créer une tâche
node cli.js natural "créer une tâche pour implémenter la fonctionnalité de notifications push"

# Mettre à jour une tâche
node cli.js natural "mettre la tâche abc123 en cours"

# Ajouter des todos
node cli.js natural "ajouter un todo à la tâche abc123 pour tester l'API"
```

### **Creating tasks in English:**
```bash
# Create task
node cli.js natural "create a task to implement user dashboard"

# Update task
node cli.js natural "update task abc123 to done"

# Add content
node cli.js natural "add content to task abc123 about API endpoints"
```

## Hierarchical Task Workflow

### **Complex task decomposition:**
```bash
# Analyser une tâche complexe
node cli.js hierarchical abc123 --structure

# Décomposition progressive
node cli.js hierarchical abc123 --progressive
```

### **Decomposition example:**
```
Main task: Implement authentication system
├── Sous-tâche 1: Modèle utilisateur
│   ├── Créer schéma base de données
│   ├── Implémenter modèle Mongoose
│   └── Ajouter validation des données
├── Sous-tâche 2: API d'authentification
│   ├── Route de connexion
│   ├── Route d'inscription
│   └── Middleware de protection
└── Sous-tâche 3: Tests
    ├── Tests unitaires
    ├── Tests d'intégration
    └── Tests de sécurité
```

## Release Workflow

### **Release preparation:**
```bash
# Créer branche de release
git checkout -b release/v1.2.0

# Mettre à jour les versions
npm version minor --no-git-tag-version

# Mettre à jour la documentation
# Faire les commits nécessaires
git add .
git commit -m "bump version to 1.2.0"

# Créer PR vers main
git push origin release/v1.2.0
```

### **Publication after merge:**
```bash
# Après merge du PR
git checkout main
git pull origin main

# Créer la release GitHub
gh release create v1.2.0 --title "Release v1.2.0" --notes "
## Changes in this release:
- New hierarchical task management
- Improved natural language processing
- Enhanced error handling

## Installation:
\`\`\`bash
npm install -g notion-ai-tasks@1.2.0
\`\`\`
"
```

## Debugging Workflow

### **Problem diagnosis:**
```bash
# Vérifier la configuration
node cli.js list

# Tester une tâche spécifique
node cli.js show abc123

# Vérifier les logs d'erreur
node cli.js update abc123 --status "In Progress" --verbose
```

### **Configuration validation:**
```bash
# Test de configuration
node -e "console.log(JSON.parse(require('fs').readFileSync('./notion-tasks.config.json')))"

# Test de connectivité Notion
node cli.js list --debug
```

## Team Workflow

### **Status synchronization:**
```bash
# Voir toutes les tâches en cours
node cli.js list --status "In Progress"

# Voir les tâches assignées
node cli.js list --assignee "John Doe"

# Mettre à jour les statuses après standups
node cli.js update abc123 --status "Done"
node cli.js update def456 --status "In Progress"
```

### **Task collaboration:**
```bash
# Ajouter des commentaires/contenu
node cli.js add-content abc123 --content "## Blocage
Besoin d'aide sur l'intégration API externe"

# Ajouter des todos collaboratifs
node cli.js todo abc123 "Revoir avec l'équipe backend" true
node cli.js todo abc123 "Valider avec le product owner" true
```