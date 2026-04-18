pipeline {
    agent any

    environment {
        // Harbor Registry configurations
        HARBOR_URL = 'localhost:8082'
        HARBOR_PROJECT = 'infractions'
        IMAGE_NAME_BACKEND = "${HARBOR_URL}/${HARBOR_PROJECT}/backend"
        IMAGE_NAME_FRONTEND = "${HARBOR_URL}/${HARBOR_PROJECT}/frontend"
        IMAGE_TAG = "v${env.BUILD_NUMBER}"
        
        // Credentials IDs in Jenkins
        HARBOR_CREDENTIALS_ID = 'harbor-credentials'
        SONAR_TOKEN_ID = 'sonar-token'
        COSIGN_KEY_ID = 'cosign-key'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('SCA - OWASP Dependency Check') {
            steps {
                // Assuming dependency-check is installed in Jenkins
                dependencyCheck additionalArguments: '--scan ./ --format HTML --format XML', odcInstallation: 'DP-Check'
                dependencyCheckPublisher pattern: 'dependency-check-report.xml'
            }
        }

        stage('SAST - SonarQube Analysis') {
            environment {
                scannerHome = tool 'SonarQubeScanner'
            }
            steps {
                withSonarQubeEnv('SonarQubeServer') {
                    sh "${scannerHome}/bin/sonar-scanner \
                        -Dsonar.projectKey=infractions_routieres \
                        -Dsonar.sources=backend_infractions-routieres,frontend_infractions-routieres"
                }
            }
        }

        stage('Quality Gate') {
            steps {
                timeout(time: 1, unit: 'HOURS') {
                    waitForQualityGate abortPipeline: true
                }
            }
        }

        stage('Build Docker Images') {
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
            steps {
                echo "Images are pushed and signed. Ready for deployment in a target environment."
                // Deployment commands can go here (e.g. helm upgrade, kubectl apply, or docker-compose pull)
            }
        }
    }

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
