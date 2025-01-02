export default async function insertCategories(db) {
    const categories = [
        {
          name: "Software Development",
          slug: "software-development",
          isActive: true
        },
        {
          name: "Web Development",
          slug: "web-development",
          isActive: true
        },
        {
          name: "Mobile Development",
          slug: "mobile-development",
          isActive: true
        },
        {
          name: "Artificial Intelligence and Machine Learning",
          slug: "artificial-intelligence-and-machine-learning",
          isActive: true
        },
        {
          name: "Cloud Computing",
          slug: "cloud-computing",
          isActive: true
        },
        {
          name: "DevOps",
          slug: "devops",
          isActive: true
        },
        {
          name: "Cybersecurity",
          slug: "cybersecurity",
          isActive: true
        },
        {
          name: "Blockchain",
          slug: "blockchain",
          isActive: true
        },
        {
          name: "Cryptocurrency",
          slug: "cryptocurrency",
          isActive: true
        },
        {
          name: "Programming Languages",
          slug: "programming-languages",
          isActive: true
        },
      ];
  
    return await db.collection('categories').insertMany(categories);
    
  };