pipeline {
    agent none

    environment {
        DOCKERHUB_USERNAME = 'nihitana29'
        IMAGE_NAME_BACKEND = "${DOCKERHUB_USERNAME}/infractions-backend"
        IMAGE_NAME_FRONTEND = "${DOCKERHUB_USERNAME}/infractions-frontend"
        IMAGE_TAG = "v${env.BUILD_NUMBER}"
        
        DOCKERHUB_CREDENTIALS_ID = 'dockerhub-credentials'
        SONAR_TOKEN_ID = 'sonar-token'
        COSIGN_KEY_ID = 'cosign-key'
        COSIGN_PASSWORD_ID = 'cosign-password'
        UBUNTU_SSH_CREDENTIALS_ID = 'ubuntu-ssh-key'
        UBUNTU_IP = '192.168.10.132'
    }

    triggers {
        pollSCM('H/5 * * * *')
    }

    stages {
        stage('Checkout') {
            agent any
            steps {
                checkout scm
            }
        }

        stage('SCA - OWASP Dependency Check') {
            agent any
            steps {
                catchError(buildResult: 'SUCCESS', stageResult: 'UNSTABLE') {
                    script {
                        withCredentials([string(credentialsId: 'nvd-api-key', variable: 'NVD_API_KEY')]) {
                            sh '''
                                if [ -f /opt/dependency-check/bin/dependency-check.sh ]; then
                                    /opt/dependency-check/bin/dependency-check.sh --scan ./ --format HTML --format XML --project infractions-routieres --out . --failOnCVSS 7 --nvdApiKey "$NVD_API_KEY" || \
                                    (echo 'NVD Update failed, attempting scan with local data only...' && \
                                     /opt/dependency-check/bin/dependency-check.sh --scan ./ --format HTML --format XML --project infractions-routieres --out . --noupdate || true)
                                else
                                    echo "Dependency Check binary not found, skipping scan."
                                fi
                            '''
                        }
                    }
                }
                script {
                    if (fileExists('dependency-check-report.xml')) {
                        dependencyCheckPublisher pattern: 'dependency-check-report.xml'
                    } else {
                        echo "SCA report not found, skipping publication."
                    }
                }
            }
        }

        stage('Unit Tests') {
            agent {
                docker {
                    image 'node:20-alpine'
                    args '--network jenkinsdocker_default --entrypoint=""'
                }
            }
            steps {
                script {
                    echo "Running Backend Tests..."
                    sh """
                        node -v
                        npm -v
                        cd backend_infractions-routieres && npm install && npm test
                    """
                    stash name: 'coverage', includes: 'backend_infractions-routieres/coverage/**'
                }
            }
        }

        stage('SAST - SonarQube Analysis') {
            agent {
                docker {
                    image 'sonarsource/sonar-scanner-cli:5.0.1'
                    args '--network jenkinsdocker_default --memory=1g --entrypoint=""'
                }
            }
            steps {
                unstash 'coverage'
                withSonarQubeEnv('SonarQubeServer') {
                    sh """sonar-scanner \
                        -Dsonar.projectKey=infractions_routieres \
                        -Dsonar.sources=backend_infractions-routieres,frontend_infractions-routieres \
                        -Dsonar.javascript.lcov.reportPaths=backend_infractions-routieres/coverage/lcov.info \
                        -Dsonar.coverage.exclusions=frontend_infractions-routieres/**,backend_infractions-routieres/tests/** \
                        -Dsonar.cpd.exclusions=**/* """
                }
            }
        }

        stage('Quality Gate') {
            agent any
            steps {
                timeout(time: 1, unit: 'HOURS') {
                    waitForQualityGate abortPipeline: false
                }
            }
        }

        stage('Build Docker Images') {
            agent any
            steps {
                script {
                    echo "Building Backend Image..."
                    sh "docker build -t ${IMAGE_NAME_BACKEND}:${IMAGE_TAG} ./backend_infractions-routieres"
                    
                    echo "Building Frontend Image..."
                    sh "docker build -t ${IMAGE_NAME_FRONTEND}:${IMAGE_TAG} ./frontend_infractions-routieres"
                }
            }
        }

        stage('Container Scanning - Trivy') {
            agent any
            steps {
                script {
                    echo "Scanning Backend Image..."
                    sh "trivy image --severity HIGH,CRITICAL --exit-code 1 ${IMAGE_NAME_BACKEND}:${IMAGE_TAG}"
                    
                    echo "Scanning Frontend Image..."
                    sh "trivy image --severity HIGH,CRITICAL --exit-code 1 ${IMAGE_NAME_FRONTEND}:${IMAGE_TAG}"
                }
            }
        }

        stage('Push to Docker Hub') {
            agent any
            steps {
                script {
                    withCredentials([usernamePassword(credentialsId: "${DOCKERHUB_CREDENTIALS_ID}", passwordVariable: 'DOCKERHUB_PASS', usernameVariable: 'DOCKERHUB_USER')]) {
                        sh 'echo "$DOCKERHUB_PASS" | docker login -u "$DOCKERHUB_USER" --password-stdin'
                        
                        // Push versioned tags
                        sh 'docker push "$IMAGE_NAME_BACKEND:$IMAGE_TAG"'
                        sh 'docker push "$IMAGE_NAME_FRONTEND:$IMAGE_TAG"'
                        
                        // Tag and Push 'latest'
                        sh 'docker tag "$IMAGE_NAME_BACKEND:$IMAGE_TAG" "$IMAGE_NAME_BACKEND:latest"'
                        sh 'docker tag "$IMAGE_NAME_FRONTEND:$IMAGE_TAG" "$IMAGE_NAME_FRONTEND:latest"'
                        sh 'docker push "$IMAGE_NAME_BACKEND:latest"'
                        sh 'docker push "$IMAGE_NAME_FRONTEND:latest"'
                    }
                }
            }
        }

        stage('Sign Images with Cosign') {
            agent any
            environment {
                COSIGN_INSECURE = 'false'
            }
            steps {
                script {
                    withCredentials([
                        file(credentialsId: "${COSIGN_KEY_ID}", variable: 'COSIGN_KEY_FILE'), 
                        string(credentialsId: "${COSIGN_PASSWORD_ID}", variable: 'COSIGN_PASSWORD'),
                        usernamePassword(credentialsId: "${DOCKERHUB_CREDENTIALS_ID}", passwordVariable: 'DOCKERHUB_PASS', usernameVariable: 'DOCKERHUB_USER')
                    ]) {
                        sh 'cosign version'
                        
                        sh '''
                            set -e
                            export COSIGN_LOG=debug
                            unset COSIGN_SIGNING_CONFIG
                            unset COSIGN_USE_SIGNING_CONFIG
                            
                            cat <<EOF > no-tlog-config.json
{
  "mediaType": "application/vnd.dev.sigstore.signingconfig.v0.2+json"
}
EOF

                            echo "Authentication to Docker Hub..."
                            echo "$DOCKERHUB_PASS" | docker login -u "$DOCKERHUB_USER" --password-stdin
                            
                            echo "$DOCKERHUB_PASS" | cosign login -u "$DOCKERHUB_USER" --password-stdin || \
                            cosign login docker.io -u "$DOCKERHUB_USER" -p "$DOCKERHUB_PASS" || true
                            
                            echo "Signing images..."
                            cosign sign --key "$COSIGN_KEY_FILE" --signing-config no-tlog-config.json "$IMAGE_NAME_BACKEND:$IMAGE_TAG" --yes
                            cosign sign --key "$COSIGN_KEY_FILE" --signing-config no-tlog-config.json "$IMAGE_NAME_FRONTEND:$IMAGE_TAG" --yes
                            cosign sign --key "$COSIGN_KEY_FILE" --signing-config no-tlog-config.json "$IMAGE_NAME_BACKEND:latest" --yes
                            cosign sign --key "$COSIGN_KEY_FILE" --signing-config no-tlog-config.json "$IMAGE_NAME_FRONTEND:latest" --yes
                            
                            echo "Verifying signatures..."
                            if [ -f "cosign.pub" ]; then
                                cosign verify --key cosign.pub "$IMAGE_NAME_BACKEND:$IMAGE_TAG"
                                cosign verify --key cosign.pub "$IMAGE_NAME_FRONTEND:$IMAGE_TAG"
                            else
                                echo "cosign.pub not found, skipping local verification."
                            fi
                        '''
                    }
                }
            }
        }
        
        stage('Deploy to Ubuntu Server') {
            agent any
            steps {
                script {
                    echo "Deploying to Ubuntu Server at ${UBUNTU_IP}..."
                    sshagent(credentials: ["${UBUNTU_SSH_CREDENTIALS_ID}"]) {
                        sh """
                            scp -o StrictHostKeyChecking=no -o BatchMode=yes -o PubkeyAuthentication=yes docker-compose.yml ubuntu@${UBUNTU_IP}:/home/ubuntu/
                            
                            ssh -o StrictHostKeyChecking=no -o BatchMode=yes -o PubkeyAuthentication=yes ubuntu@${UBUNTU_IP} '
                                cd /home/ubuntu
                                docker-compose pull
                                docker-compose up -d --remove-orphans
                            '
                        """
                    }
                }
            }
}
    }

    post {
        always {
            // Correction : node('') permet d'exécuter le cleanWs sur l'agent par défaut 
            // sans chercher un label spécifique qui n'existe pas
            node('') {
                cleanWs()
            }
        }
        success {
            echo "Pipeline executed successfully!"
        }
        failure {
            echo "Pipeline failed! Check logs."
        }
    }
}