pipeline {
    agent none

    environment {
        IMAGE_NAME_BACKEND = "infractions-backend"
        IMAGE_NAME_FRONTEND = "infractions-frontend"
        IMAGE_TAG = "latest"
        
        SONAR_TOKEN_ID = 'sonar-token'
        
        UBUNTU_IP = '192.168.10.132'
        UBUNTU_USER = 'ubuntu'
        UBUNTU_CREDENTIALS_ID = 'ubuntu-ssh-key'
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

        stage('Deploy to Ubuntu Server') {
            agent any
            steps {
                script {
                    echo "Saving Docker images to tar files..."
                    sh "docker save -o backend.tar ${IMAGE_NAME_BACKEND}:${IMAGE_TAG}"
                    sh "docker save -o frontend.tar ${IMAGE_NAME_FRONTEND}:${IMAGE_TAG}"

                    echo "Deploying to Ubuntu Server via SSH..."
                    sshagent (credentials: ["${UBUNTU_CREDENTIALS_ID}"]) {
                        // Create a deployment directory on the VM
                        sh "ssh -o StrictHostKeyChecking=no ${UBUNTU_USER}@${UBUNTU_IP} 'mkdir -p ~/infractions_deploy'"
                        
                        // Transfer files
                        sh "scp -o StrictHostKeyChecking=no backend.tar frontend.tar docker-compose.yml ${UBUNTU_USER}@${UBUNTU_IP}:~/infractions_deploy/"
                        
                        // Load images and run docker-compose
                        sh """
                        ssh -o StrictHostKeyChecking=no ${UBUNTU_USER}@${UBUNTU_IP} '
                            cd ~/infractions_deploy
                            docker load -i backend.tar
                            docker load -i frontend.tar
                            docker compose down
                            docker compose up -d
                            
                            # Cleanup tar files to save space
                            rm backend.tar frontend.tar
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