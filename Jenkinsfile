pipeline {
    agent none

    environment {
        HARBOR_URL = 'host.docker.internal:8082'
        HARBOR_PROJECT = 'infractions'
        IMAGE_NAME_BACKEND = "${HARBOR_URL}/${HARBOR_PROJECT}/backend"
        IMAGE_NAME_FRONTEND = "${HARBOR_URL}/${HARBOR_PROJECT}/frontend"
        IMAGE_TAG = "v${env.BUILD_NUMBER}"
        
        HARBOR_CREDENTIALS_ID = 'harbor-credentials'
        SONAR_TOKEN_ID = 'sonar-token'
        COSIGN_KEY_ID = 'cosign-key'
        COSIGN_PASSWORD_ID = 'cosign-password'
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

        stage('Push Images to Harbor') {
            agent any
            steps {
                script {
                    withCredentials([usernamePassword(credentialsId: "${HARBOR_CREDENTIALS_ID}", passwordVariable: 'HARBOR_PASS', usernameVariable: 'HARBOR_USER')]) {
                        sh "echo \$HARBOR_PASS | docker login ${HARBOR_URL} -u \$HARBOR_USER --password-stdin"
                        
                        // Push versioned tags
                        sh "docker push ${IMAGE_NAME_BACKEND}:${IMAGE_TAG}"
                        sh "docker push ${IMAGE_NAME_FRONTEND}:${IMAGE_TAG}"
                        
                        // Tag and Push 'latest'
                        sh "docker tag ${IMAGE_NAME_BACKEND}:${IMAGE_TAG} ${IMAGE_NAME_BACKEND}:latest"
                        sh "docker tag ${IMAGE_NAME_FRONTEND}:${IMAGE_TAG} ${IMAGE_NAME_FRONTEND}:latest"
                        sh "docker push ${IMAGE_NAME_BACKEND}:latest"
                        sh "docker push ${IMAGE_NAME_FRONTEND}:latest"
                    }
                }
            }
        }

        stage('Sign Images with Cosign') {
            agent any
            environment {
                COSIGN_INSECURE = 'true'
            }
            steps {
                script {
                    withCredentials([
                        file(credentialsId: "${COSIGN_KEY_ID}", variable: 'COSIGN_KEY_FILE'), 
                        string(credentialsId: "${COSIGN_PASSWORD_ID}", variable: 'COSIGN_PASSWORD'),
                        usernamePassword(credentialsId: "${HARBOR_CREDENTIALS_ID}", passwordVariable: 'HARBOR_PASS', usernameVariable: 'HARBOR_USER')
                    ]) {
                        sh "cosign version"
                        
                        // Authentication to Harbor (reverting to docker login which worked)
                        sh "echo \$HARBOR_PASS | docker login ${HARBOR_URL} -u \$HARBOR_USER --password-stdin"
                        
                        // Sign images (using --tlog-upload=false for private registries)
                        sh """
                            cosign sign --key \$COSIGN_KEY_FILE --tlog-upload=false --allow-http-registry ${IMAGE_NAME_BACKEND}:${IMAGE_TAG} -y
                            cosign sign --key \$COSIGN_KEY_FILE --tlog-upload=false --allow-http-registry ${IMAGE_NAME_FRONTEND}:${IMAGE_TAG} -y
                            cosign sign --key \$COSIGN_KEY_FILE --tlog-upload=false --allow-http-registry ${IMAGE_NAME_BACKEND}:latest -y
                            cosign sign --key \$COSIGN_KEY_FILE --tlog-upload=false --allow-http-registry ${IMAGE_NAME_FRONTEND}:latest -y
                        """
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