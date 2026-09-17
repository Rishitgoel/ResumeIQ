from typing import Dict, List, Optional

SKILL_TAXONOMY: Dict[str, Dict[str, any]] = {
    # Programming Languages
    "Python": {"category": "PROGRAMMING_LANGUAGES", "aliases": ["python3", "python 3", "py"]},
    "JavaScript": {"category": "PROGRAMMING_LANGUAGES", "aliases": ["js", "ecmascript", "es6", "vanilla js"]},
    "TypeScript": {"category": "PROGRAMMING_LANGUAGES", "aliases": ["ts"]},
    "Java": {"category": "PROGRAMMING_LANGUAGES", "aliases": ["core java", "java 8", "java 11", "java 17", "java 21"]},
    "C++": {"category": "PROGRAMMING_LANGUAGES", "aliases": ["cpp", "cplusplus", "c/c++"]},
    "C#": {"category": "PROGRAMMING_LANGUAGES", "aliases": ["csharp", "c sharp", ".net c#"]},
    "C": {"category": "PROGRAMMING_LANGUAGES", "aliases": ["c language", "ansi c"]},
    "Go": {"category": "PROGRAMMING_LANGUAGES", "aliases": ["golang"]},
    "Rust": {"category": "PROGRAMMING_LANGUAGES", "aliases": ["rust-lang"]},
    "Ruby": {"category": "PROGRAMMING_LANGUAGES", "aliases": []},
    "PHP": {"category": "PROGRAMMING_LANGUAGES", "aliases": ["php7", "php8"]},
    "Swift": {"category": "PROGRAMMING_LANGUAGES", "aliases": ["swift5"]},
    "Kotlin": {"category": "PROGRAMMING_LANGUAGES", "aliases": []},
    "SQL": {"category": "PROGRAMMING_LANGUAGES", "aliases": ["structured query language", "t-sql", "pl/sql"]},
    "HTML": {"category": "PROGRAMMING_LANGUAGES", "aliases": ["html5"]},
    "CSS": {"category": "PROGRAMMING_LANGUAGES", "aliases": ["css3"]},
    "R": {"category": "PROGRAMMING_LANGUAGES", "aliases": ["r programming", "r-lang"]},
    "Scala": {"category": "PROGRAMMING_LANGUAGES", "aliases": []},
    "Dart": {"category": "PROGRAMMING_LANGUAGES", "aliases": []},
    "Shell": {"category": "PROGRAMMING_LANGUAGES", "aliases": ["bash", "sh", "zsh", "shell script", "shell scripting"]},
    "PowerShell": {"category": "PROGRAMMING_LANGUAGES", "aliases": ["ps"]},

    # Web & Application Frameworks
    "React": {"category": "FRAMEWORKS", "aliases": ["react.js", "reactjs", "react framework"]},
    "Next.js": {"category": "FRAMEWORKS", "aliases": ["nextjs", "next.js 13", "next.js 14", "next.js 15"]},
    "Vue": {"category": "FRAMEWORKS", "aliases": ["vue.js", "vuejs", "vue3"]},
    "Angular": {"category": "FRAMEWORKS", "aliases": ["angular.js", "angularjs", "angular 2+"]},
    "Svelte": {"category": "FRAMEWORKS", "aliases": ["sveltekit", "svelte.js"]},
    "Node.js": {"category": "FRAMEWORKS", "aliases": ["nodejs", "node"]},
    "FastAPI": {"category": "FRAMEWORKS", "aliases": ["fast api", "fast-api"]},
    "Django": {"category": "FRAMEWORKS", "aliases": ["django rest framework", "drf"]},
    "Flask": {"category": "FRAMEWORKS", "aliases": []},
    "Express": {"category": "FRAMEWORKS", "aliases": ["express.js", "expressjs"]},
    "NestJS": {"category": "FRAMEWORKS", "aliases": ["nest.js", "nest js"]},
    "Spring Boot": {"category": "FRAMEWORKS", "aliases": ["spring", "spring framework", "spring-boot"]},
    "ASP.NET": {"category": "FRAMEWORKS", "aliases": [".net", "asp.net core", ".net core", "dotnet"]},
    "Ruby on Rails": {"category": "FRAMEWORKS", "aliases": ["rails", "ror"]},
    "Laravel": {"category": "FRAMEWORKS", "aliases": []},
    "Tailwind CSS": {"category": "FRAMEWORKS", "aliases": ["tailwind", "tailwindcss"]},
    "Bootstrap": {"category": "FRAMEWORKS", "aliases": ["bootstrap 5", "twitter bootstrap"]},
    "Redux": {"category": "FRAMEWORKS", "aliases": ["redux toolkit", "rtk"]},
    "React Native": {"category": "FRAMEWORKS", "aliases": ["react-native"]},
    "Flutter": {"category": "FRAMEWORKS", "aliases": []},

    # Machine Learning, Data & AI
    "PyTorch": {"category": "FRAMEWORKS", "aliases": ["torch"]},
    "TensorFlow": {"category": "FRAMEWORKS", "aliases": ["tf", "tensorflow 2"]},
    "Keras": {"category": "FRAMEWORKS", "aliases": []},
    "Scikit-learn": {"category": "FRAMEWORKS", "aliases": ["sklearn", "scikit learn"]},
    "Pandas": {"category": "FRAMEWORKS", "aliases": []},
    "NumPy": {"category": "FRAMEWORKS", "aliases": []},
    "OpenCV": {"category": "FRAMEWORKS", "aliases": ["cv2"]},
    "Hugging Face": {"category": "FRAMEWORKS", "aliases": ["transformers", "huggingface"]},
    "LangChain": {"category": "FRAMEWORKS", "aliases": ["lang chain"]},
    "LlamaIndex": {"category": "FRAMEWORKS", "aliases": []},
    "NLP": {"category": "FRAMEWORKS", "aliases": ["natural language processing", "spacy", "nltk"]},
    "Computer Vision": {"category": "FRAMEWORKS", "aliases": ["cv", "image processing"]},
    "Deep Learning": {"category": "FRAMEWORKS", "aliases": ["neural networks", "dl", "ann", "cnn", "rnn"]},
    "Machine Learning": {"category": "FRAMEWORKS", "aliases": ["ml", "supervised learning", "unsupervised learning"]},

    # Databases & Storage
    "PostgreSQL": {"category": "DATABASES", "aliases": ["postgres", "pgsql", "postgre"]},
    "MySQL": {"category": "DATABASES", "aliases": []},
    "MongoDB": {"category": "DATABASES", "aliases": ["mongo"]},
    "Redis": {"category": "DATABASES", "aliases": ["redis cache"]},
    "SQLite": {"category": "DATABASES", "aliases": ["sqlite3"]},
    "Cassandra": {"category": "DATABASES", "aliases": ["apache cassandra"]},
    "DynamoDB": {"category": "DATABASES", "aliases": ["aws dynamodb", "amazon dynamodb"]},
    "Elasticsearch": {"category": "DATABASES", "aliases": ["elastic search", "opensearch", "elk stack"]},
    "Oracle Database": {"category": "DATABASES", "aliases": ["oracle db", "oracle sql"]},
    "Microsoft SQL Server": {"category": "DATABASES", "aliases": ["sql server", "mssql"]},
    "Firebase": {"category": "DATABASES", "aliases": ["firestore", "firebase realtime database"]},
    "Snowflake": {"category": "DATABASES", "aliases": ["snowflake db"]},
    "BigQuery": {"category": "DATABASES", "aliases": ["google bigquery"]},
    "Neo4j": {"category": "DATABASES", "aliases": ["graph database", "cypher"]},

    # Cloud, DevOps & Infrastructure
    "Amazon Web Services": {"category": "CLOUD_DEVOPS", "aliases": ["aws", "amazon cloud", "aws lambda", "ec2", "s3", "ecs"]},
    "Google Cloud Platform": {"category": "CLOUD_DEVOPS", "aliases": ["gcp", "google cloud"]},
    "Microsoft Azure": {"category": "CLOUD_DEVOPS", "aliases": ["azure"]},
    "Docker": {"category": "CLOUD_DEVOPS", "aliases": ["docker containers", "dockerfile", "docker compose"]},
    "Kubernetes": {"category": "CLOUD_DEVOPS", "aliases": ["k8s", "kube"]},
    "Terraform": {"category": "CLOUD_DEVOPS", "aliases": ["iac", "infrastructure as code"]},
    "Ansible": {"category": "CLOUD_DEVOPS", "aliases": []},
    "Jenkins": {"category": "CLOUD_DEVOPS", "aliases": []},
    "GitHub Actions": {"category": "CLOUD_DEVOPS", "aliases": ["gh actions", "github action"]},
    "GitLab CI": {"category": "CLOUD_DEVOPS", "aliases": ["gitlab ci/cd"]},
    "CI/CD": {"category": "CLOUD_DEVOPS", "aliases": ["cicd", "continuous integration", "continuous deployment"]},
    "Linux": {"category": "CLOUD_DEVOPS", "aliases": ["ubuntu", "debian", "centos", "redhat", "alpine"]},
    "Nginx": {"category": "CLOUD_DEVOPS", "aliases": ["nginx reverse proxy"]},
    "Apache": {"category": "CLOUD_DEVOPS", "aliases": ["httpd"]},
    "Helm": {"category": "CLOUD_DEVOPS", "aliases": []},
    "Prometheus": {"category": "CLOUD_DEVOPS", "aliases": []},
    "Grafana": {"category": "CLOUD_DEVOPS", "aliases": []},
    "Cloudflare": {"category": "CLOUD_DEVOPS", "aliases": []},

    # Architecture, Protocols & Tools
    "REST API": {"category": "TOOLS_METHODS", "aliases": ["restful", "rest apis", "restful api", "rest api development"]},
    "GraphQL": {"category": "TOOLS_METHODS", "aliases": ["apollo graphql"]},
    "Microservices": {"category": "TOOLS_METHODS", "aliases": ["microservice architecture", "distributed systems"]},
    "gRPC": {"category": "TOOLS_METHODS", "aliases": ["protocol buffers", "protobuf"]},
    "WebSockets": {"category": "TOOLS_METHODS", "aliases": ["websocket", "socket.io"]},
    "Kafka": {"category": "TOOLS_METHODS", "aliases": ["apache kafka"]},
    "RabbitMQ": {"category": "TOOLS_METHODS", "aliases": []},
    "Celery": {"category": "TOOLS_METHODS", "aliases": ["celery worker", "distributed task queue"]},
    "Git": {"category": "TOOLS_METHODS", "aliases": ["version control", "git flow"]},
    "Postman": {"category": "TOOLS_METHODS", "aliases": []},
    "Swagger": {"category": "TOOLS_METHODS", "aliases": ["openapi", "openapi 3"]},
    "Jira": {"category": "TOOLS_METHODS", "aliases": ["atlassian jira"]},
    "Agile": {"category": "TOOLS_METHODS", "aliases": ["scrum", "kanban", "sprint planning"]},
    "Unit Testing": {"category": "TOOLS_METHODS", "aliases": ["tdd", "test driven development", "unit tests"]},
    "Pytest": {"category": "TOOLS_METHODS", "aliases": []},
    "Jest": {"category": "TOOLS_METHODS", "aliases": []},
    "SQLAlchemy": {"category": "TOOLS_METHODS", "aliases": ["orm", "sqlalchemy 2.0"]},
    "Alembic": {"category": "TOOLS_METHODS", "aliases": ["db migrations"]},

    # Soft Skills
    "Leadership": {"category": "SOFT_SKILLS", "aliases": ["team leadership", "technical leadership", "leading teams"]},
    "Communication": {"category": "SOFT_SKILLS", "aliases": ["verbal communication", "written communication", "presentation skills"]},
    "Problem Solving": {"category": "SOFT_SKILLS", "aliases": ["analytical skills", "troubleshooting", "debugging"]},
    "Teamwork": {"category": "SOFT_SKILLS", "aliases": ["collaboration", "cross-functional collaboration"]},
    "Mentoring": {"category": "SOFT_SKILLS", "aliases": ["mentorship", "coaching juniors"]},
    "Critical Thinking": {"category": "SOFT_SKILLS", "aliases": ["decision making"]},
    "Time Management": {"category": "SOFT_SKILLS", "aliases": ["prioritization", "deadline management"]},
}

# Build lookup map: lowercase variant -> canonical skill name
LOOKUP_MAP: Dict[str, str] = {}
for canonical, data in SKILL_TAXONOMY.items():
    LOOKUP_MAP[canonical.lower()] = canonical
    for alias in data["aliases"]:
        LOOKUP_MAP[alias.lower()] = canonical

def get_canonical_skill(name: str) -> Optional[str]:
    """Resolve an arbitrary skill name to its canonical taxonomy representation."""
    cleaned = name.strip().lower()
    return LOOKUP_MAP.get(cleaned)

def get_skill_category(canonical_name: str) -> str:
    """Return category for a canonical skill."""
    data = SKILL_TAXONOMY.get(canonical_name)
    if data:
        return data.get("category", "OTHER")
    return "OTHER"
