export default async function insertTags(db) {
    const tags = [
        {
          name: "JavaScript",
          slug: "javascript",
          isActive: true
        },
        {
          name: "React",
          slug: "react",
          isActive: true
        },
        {
          name: "Node.js",
          slug: "nodejs",
          isActive: true
        },
        {
          name: "Python",
          slug: "python",
          isActive: true
        },
        {
          name: "Django",
          slug: "django",
          isActive: true
        },
        {
          name: "AI",
          slug: "ai",
          isActive: true
        },
        {
          name: "Machine Learning",
          slug: "machine-learning",
          isActive: true
        },
        {
          name: "Data Science",
          slug: "data-science",
          isActive: true
        },
        {
          name: "Cloud",
          slug: "cloud",
          isActive: true
        },
        {
          name: "AWS",
          slug: "aws",
          isActive: true
        },
        {
          name: "Azure",
          slug: "azure",
          isActive: true
        },
        {
          name: "Docker",
          slug: "docker",
          isActive: true
        },
        {
          name: "Kubernetes",
          slug: "kubernetes",
          isActive: true
        },
        {
          name: "WebAssembly",
          slug: "webassembly",
          isActive: true
        },
        {
          name: "GraphQL",
          slug: "graphql",
          isActive: true
        },
        {
          name: "Next.js",
          slug: "nextjs",
          isActive: true
        },
        {
          name: "TypeScript",
          slug: "typescript",
          isActive: true
        },
        {
          name: "Vue.js",
          slug: "vuejs",
          isActive: true
        },
        {
          name: "Angular",
          slug: "angular",
          isActive: true
        }, 
        {
          name: "Git and GitHub",
          slug: "git-and-github",
          isActive: true
        },
      ];
  
    return await db.collection('tags').insertMany(tags);
  };