# Analyse de Risques STRIDE - Pipeline DevSecOps

Ce document présente l'analyse des risques basée sur le modèle STRIDE pour la chaîne CI/CD du projet `infractions_routieres`, ainsi que les mesures de mitigation alignées sur les recommandations de l'OWASP.

## 1. Spoofing (Usurpation d'identité)
**Risque :** Un acteur malveillant usurpe l'identité d'un développeur pour pousser du code non autorisé, ou usurpe l'identité de Jenkins pour pousser des images frauduleuses sur Harbor.
**Mitigation :**
- **Jenkins :** Authentification obligatoire (LDAP, SSO), gestion fine des RBAC.
- **Harbor :** Utilisation de `Robot Accounts` dans Harbor spécifiques au projet avec des droits limités (`push` uniquement).
- **Git :** Exigence de signatures GPG pour les commits.

## 2. Tampering (Altération des données)
**Risque :** Modification du code source pendant le transit, altération des images Docker dans le registre Harbor.
**Mitigation :**
- **Cosign :** Signature cryptographique des images Docker poussées sur Harbor. Les environnements cibles refuseront les images non signées.
- **Trivy / SonarQube :** Empêchent l'injection de dépendances vérolées ou de failles de sécurité dans le code qui pourraient faciliter l'altération.
- **HTTPS/TLS :** Chiffrement des communications entre Git, Jenkins et Harbor.

## 3. Repudiation (Répudiation)
**Risque :** Impossibilité de tracer qui a déclenché un pipeline, approuvé un déploiement ou modifié le code.
**Mitigation :**
- **Audit Logs :** Activation et centralisation des logs d'audit de Jenkins, SonarQube et Harbor.
- **Git History :** Protection de la branche principale (main/master) contre les réécritures d'historique (force push).

## 4. Information Disclosure (Divulgation d'informations)
**Risque :** Fuite de secrets (clés d'API, mots de passe de base de données, certificats) via le code source ou les logs de Jenkins.
**Mitigation :**
- **Secrets Management :** Utilisation du `Credential Manager` de Jenkins pour masquer les secrets dans les logs. Aucun secret en dur dans le code ou le Dockerfile.
- **SAST (SonarQube) :** Détection automatique des secrets commités par erreur.
- **Trivy :** Détection de secrets et de configurations non sécurisées dans les images Docker (`trivy image`).

## 5. Denial of Service (Déni de Service)
**Risque :** Saturation des ressources de l'infrastructure CI/CD (Jenkins bloqué, Harbor indisponible, pipeline trop long).
**Mitigation :**
- **Limites de Ressources :** Configuration de quotas et limites de ressources dans les `Robot Accounts` Harbor et pour les agents Jenkins.
- **Timeout :** Mise en place de délais d'expiration (timeouts) stricts sur les étapes du pipeline Jenkins.

## 6. Elevation of Privilege (Élévation de privilèges)
**Risque :** Exécution de code arbitraire par l'exploitation de vulnérabilités dans les dépendances (NPM) ou dans l'image de base Docker, permettant l'escalade de privilèges sur le serveur hôte.
**Mitigation :**
- **SCA (OWASP Dependency Check) :** Scan rigoureux des vulnérabilités des bibliothèques (`package.json`).
- **Trivy :** Scan des images Docker pour repérer les failles du système d'exploitation et des paquets logiciels. L'image de base choisie est minimale (`alpine`).
- **Principe du moindre privilège :** Exécution des applications Node.js et Nginx avec des utilisateurs non-root dans les Dockerfiles (à ajouter lors du renforcement final).

---
**Conclusion :** La chaîne CI/CD implémentée couvre l'ensemble des axes du modèle STRIDE grâce à une combinaison d'outils d'analyse statique (SonarQube), d'analyse de dépendances (OWASP DC), de scan de conteneurs (Trivy) et de notarisation d'images (Cosign).
