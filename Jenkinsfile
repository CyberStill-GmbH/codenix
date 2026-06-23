pipeline {
  agent any

  options {
    timestamps()
    buildDiscarder(logRotator(numToKeepStr: '20'))
  }

  environment {
    CI_DOCKER_NETWORK = 'codenix-jenkins'
    CI_POSTGRES_NAME = "codenix-ci-postgres-${BUILD_NUMBER}"
    CI_REDIS_NAME = "codenix-ci-redis-${BUILD_NUMBER}"
  }

  stages {
    stage('Install frontend dependencies') {
      steps {
        dir('frontend') {
          sh 'npm ci'
        }
      }
    }

    stage('Validate frontend') {
      steps {
        dir('frontend') {
          sh 'npm run lint'
          sh 'npm run build'
        }
      }
    }

    stage('Install backend dependencies') {
      steps {
        dir('backend') {
          sh 'npm ci'
          sh 'npm run db:generate'
        }
      }
    }

    stage('Build backend') {
      steps {
        dir('backend') {
          sh 'npm run build'
        }
      }
    }

    stage('Start CI services') {
      steps {
        sh '''
          set -eu

          docker rm -f "$CI_POSTGRES_NAME" "$CI_REDIS_NAME" >/dev/null 2>&1 || true

          docker run -d \
            --name "$CI_POSTGRES_NAME" \
            --network "$CI_DOCKER_NETWORK" \
            -e POSTGRES_USER=codenix \
            -e POSTGRES_PASSWORD=codenix \
            -e POSTGRES_DB=codenix_test \
            postgres:16-alpine

          docker run -d \
            --name "$CI_REDIS_NAME" \
            --network "$CI_DOCKER_NETWORK" \
            redis:7-alpine

          for i in $(seq 1 30); do
            if docker exec "$CI_POSTGRES_NAME" pg_isready -U codenix -d codenix_test; then
              break
            fi
            sleep 2
          done

          docker exec "$CI_POSTGRES_NAME" pg_isready -U codenix -d codenix_test

          for i in $(seq 1 30); do
            if docker exec "$CI_REDIS_NAME" redis-cli ping | grep -q PONG; then
              break
            fi
            sleep 1
          done

          docker exec "$CI_REDIS_NAME" redis-cli ping | grep -q PONG
        '''
      }
    }

    stage('Test backend') {
      steps {
        dir('backend') {
          sh '''
            set -eu

            cp .env.test .env.test.jenkins.bak
            trap 'mv .env.test.jenkins.bak .env.test' EXIT

            cat > .env.test <<EOF
NODE_ENV=test
PORT=4001
DATABASE_URL="postgresql://codenix:codenix@${CI_POSTGRES_NAME}:5432/codenix_test?schema=public"
REDIS_URL="redis://${CI_REDIS_NAME}:6379"
JWT_ACCESS_SECRET="test_access_secret_32_chars_minimum"
JWT_ACCESS_EXPIRES_IN="1d"
FRONTEND_URL="http://localhost:5173"
EOF

            npm test
          '''
        }
      }
    }
  }

  post {
    always {
      sh '''
        docker rm -f "$CI_POSTGRES_NAME" "$CI_REDIS_NAME" >/dev/null 2>&1 || true
      '''
      cleanWs(deleteDirs: true, disableDeferredWipeout: true)
    }
  }
}

