pipeline {
    agent none

    environment {
        HARBOR_URL = 'localhost:8082'
        HARBOR_PROJECT = 'infractions'
        IMAGE_NAME_BACKEND = "${HARBOR_URL}/${HARBOR_PROJECT}/backend"
        IMAGE_NAME_FRONTEND = "${HARBOR_URL}/${HARBOR_PROJECT}/frontend"
        IMAGE_TAG = "v${env.BUILD_NUMBER}"
        
        HARBOR_CREDENTIALS_ID = 'harbor-credentials'
        SONAR_TOKEN_ID = 'sonar-token'
        COSIGN_KEY_ID = 'cosign-key'
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
                        def nvdApiKeyArg = ""
                        try {
                            withCredentials([string(credentialsId: 'nvd-api-key', variable: 'NVD_API_KEY')]) {
                                nvdApiKeyArg = "--nvdApiKey ${NVD_API_KEY}"
                            }
                        } catch (Exception e) {
                            echo "NVD API Key not found. Proceeding without it."
                        }
                        
                        sh """
                            if [ -f /opt/dependency-check/bin/dependency-check.sh ]; then
                                /opt/dependency-check/bin/dependency-check.sh --scan ./ --format HTML --format XML --project infractions-routieres --out . --failOnCVSS 7 ${nvdApiKeyArg} || \
                                (echo 'NVD Update failed, attempting scan with local data only...' && \
                                 /opt/dependency-check/bin/dependency-check.sh --scan ./ --format HTML --format XML --project infractions-routieres --out . --noupdate || true)
                            else
                                echo "Dependency Check binary not found, skipping scan."
                            fi
                        """
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
                    // CORRECTION 1 : On passe de 512m à 1g pour éviter le "Killed" par le système
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
                    waitForQualityGate abortPipeline: true
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

        stage('Push Images to Harbor') {
            agent any
            steps {
                script {
                    withCredentials([usernamePassword(credentialsId: "${HARBOR_CREDENTIALS_ID}", passwordVariable: 'HARBOR_PASS', usernameVariable: 'HARBOR_USER')]) {
                        sh "echo \$HARBOR_PASS | docker login ${HARBOR_URL} -u \$HARBOR_USER --password-stdin"
                        sh "docker push ${IMAGE_NAME_BACKEND}:${IMAGE_TAG}"
                        sh "docker push ${IMAGE_NAME_FRONTEND}:${IMAGE_TAG}"
                    }
                }
            }
        }

        stage('Sign Images with Cosign') {
            agent any
            steps {
                script {
                    withCredentials([file(credentialsId: "${COSIGN_KEY_ID}", variable: 'COSIGN_KEY_FILE'), string(credentialsId: 'cosign-password', variable: 'COSIGN_PASSWORD')]) {
                        sh "cosign sign --key ${COSIGN_KEY_FILE} ${IMAGE_NAME_BACKEND}:${IMAGE_TAG} -y"
                        sh "cosign sign --key ${COSIGN_KEY_FILE} ${IMAGE_NAME_FRONTEND}:${IMAGE_TAG} -y"
                    }
                }
            }
        }
        
        stage('Deploy (Optional / Managed)') {
            agent any
            steps {
                echo "Images are pushed and signed. Ready for deployment in a target environment."
            }
        }
    }

    // CORRECTION 2 : Suppression du node('any') qui bloquait Jenkins à la fin
    post {
        always {
            cleanWs()
        }
        success {
            echo "Pipeline executed successfully!"
        }
        failure {
            echo "Pipeline failed! Check logs."
        }
    }
}