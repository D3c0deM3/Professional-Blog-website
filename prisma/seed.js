const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
  const hashedPassword = await bcrypt.hash('admin123', 10)

  await prisma.user.upsert({
    where: { email: 'admin@university.edu' },
    update: {
      name: 'Admin User',
      password: hashedPassword,
      role: 'admin',
    },
    create: {
      email: 'admin@university.edu',
      name: 'Admin User',
      password: hashedPassword,
      role: 'admin',
    },
  })

  const aboutMarkdown = `## Biography
Dr. John Smith is a distinguished professor of Computer Science with over 15 years of experience in teaching and research. His work focuses on algorithm design, data structure optimization, and computational complexity theory.

## Research
His research interests include graph algorithms, dynamic data structures, and the theoretical foundations of efficient computation. He has published extensively in top-tier conferences and journals.

## Teaching
Dr. John Smith is passionate about making complex computer science concepts accessible to students. He has taught courses ranging from introductory programming to advanced graduate seminars in algorithms.`

  await prisma.page.upsert({
    where: { slug: 'about' },
    update: {
      title: 'About Professor',
      content: aboutMarkdown,
      published: true,
    },
    create: {
      slug: 'about',
      title: 'About Professor',
      content: aboutMarkdown,
      published: true,
    },
  })

  await prisma.page.upsert({
    where: { slug: 'collaboration' },
    update: {
      title: 'Collaboration',
      content: `## Collaboration
I welcome collaboration on projects in data structures, graph algorithms, and algorithm engineering. If your work aligns with these areas, please reach out with a short summary and relevant publications.`,
      published: true,
    },
    create: {
      slug: 'collaboration',
      title: 'Collaboration',
      content: `## Collaboration
I welcome collaboration on projects in data structures, graph algorithms, and algorithm engineering. If your work aligns with these areas, please reach out with a short summary and relevant publications.`,
      published: true,
    },
  })

  const categories = [
    { name: 'Lecture Notes', slug: 'lecture-notes', description: 'Course lecture materials' },
    { name: 'Assignments', slug: 'assignments', description: 'Problem sets and projects' },
    { name: 'Code Examples', slug: 'code-examples', description: 'Sample implementations' },
    { name: 'Reference', slug: 'reference', description: 'Additional reading materials' },
  ]

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: cat,
      create: cat,
    })
  }

  const categoryMap = await prisma.category.findMany()
  const categoryBySlug = Object.fromEntries(categoryMap.map((cat) => [cat.slug, cat.id]))

  const materials = [
    {
      title: 'Introduction to Data Structures',
      description: 'Lecture notes covering arrays, linked lists, stacks, and queues.',
      fileUrl: '/uploads/intro-data-structures.pdf',
      fileType: 'pdf',
      fileSize: '2.4 MB',
      categoryId: categoryBySlug['lecture-notes'],
      published: true,
    },
    {
      title: 'Algorithm Analysis Problem Set',
      description: 'Practice problems for asymptotic analysis and Big-O notation.',
      fileUrl: '/uploads/algorithm-analysis-problems.pdf',
      fileType: 'pdf',
      fileSize: '1.1 MB',
      categoryId: categoryBySlug['assignments'],
      published: true,
    },
    {
      title: 'Binary Search Tree Implementation',
      description: 'Reference implementation with insertion, deletion, and traversal.',
      fileUrl: '/uploads/bst-implementation.zip',
      fileType: 'archive',
      fileSize: '85 KB',
      categoryId: categoryBySlug['code-examples'],
      published: true,
    },
    {
      title: 'Advanced Graph Algorithms',
      description: 'Lecture notes on shortest paths, MSTs, and network flows.',
      fileUrl: '/uploads/advanced-graph-algorithms.pdf',
      fileType: 'pdf',
      fileSize: '3.2 MB',
      categoryId: categoryBySlug['lecture-notes'],
      published: true,
    },
    {
      title: 'Dynamic Programming Exercises',
      description: 'Weekly problem set focused on DP patterns and proofs.',
      fileUrl: '/uploads/dp-exercises.pdf',
      fileType: 'pdf',
      fileSize: '1.6 MB',
      categoryId: categoryBySlug['assignments'],
      published: true,
    },
    {
      title: 'Union-Find Reference Implementation',
      description: 'Disjoint set union implementation with path compression.',
      fileUrl: '/uploads/union-find-code.zip',
      fileType: 'code',
      fileSize: '24 KB',
      categoryId: categoryBySlug['code-examples'],
      published: true,
    },
    {
      title: 'Complexity Reference Sheet',
      description: 'Quick reference of common data structure complexities.',
      fileUrl: '/uploads/complexity-reference.pdf',
      fileType: 'pdf',
      fileSize: '420 KB',
      categoryId: categoryBySlug['reference'],
      published: true,
    },
  ]

  for (const material of materials) {
    if (material.categoryId) {
      await prisma.material.create({ data: material })
    }
  }

  const papers = [
    {
      title: 'Optimal Dynamic Data Structures for Graph Connectivity',
      authors: 'J. Smith, A. Johnson, M. Williams',
      journal: 'Journal of Algorithms',
      year: 2023,
      abstract:
        'We present new dynamic data structures for maintaining graph connectivity under edge insertions and deletions with improved amortized time bounds.',
      featured: true,
    },
    {
      title: 'A Novel Approach to Balanced Tree Rebalancing',
      authors: 'J. Smith, R. Brown',
      journal: 'ACM Transactions on Algorithms',
      year: 2022,
      abstract:
        'This paper introduces a new rebalancing strategy for self-balancing binary search trees that achieves better worst-case performance.',
      featured: true,
    },
    {
      title: 'Cache-Efficient Algorithms for Large-Scale Data Processing',
      authors: 'J. Smith, K. Lee, S. Patel',
      journal: 'IEEE Transactions on Computers',
      year: 2021,
      abstract:
        'We analyze cache performance of fundamental algorithms and propose optimizations for modern memory hierarchies.',
      featured: false,
    },
    {
      title: 'Succinct Representations for Dynamic Graphs',
      authors: 'J. Smith, L. Chen',
      journal: 'SIAM Journal on Computing',
      year: 2020,
      abstract:
        'We present succinct data structure techniques for dynamic graph queries with provable bounds.',
      featured: false,
    },
    {
      title: 'Parallel BFS with Work-Optimal Complexity',
      authors: 'J. Smith, R. Gupta',
      journal: 'Proceedings of SPAA',
      year: 2019,
      abstract:
        'A work-optimal parallel BFS algorithm with improved synchronization overhead.',
      featured: false,
    },
    {
      title: 'Streaming Algorithms for Large-Scale Graph Metrics',
      authors: 'J. Smith, M. Alvarez',
      journal: 'ACM SIGMOD',
      year: 2024,
      abstract:
        'We propose streaming algorithms for estimating graph metrics in sublinear space.',
      featured: true,
    },
  ]

  for (const paper of papers) {
    await prisma.paper.create({ data: paper })
  }

  const projects = [
    {
      title: 'Algorithm Visualizer',
      description:
        'An interactive web-based tool for visualizing fundamental algorithms including sorting, graph traversal, and tree operations.',
      technologies: 'React, TypeScript, D3.js',
      githubUrl: 'https://github.com/professor/algorithm-visualizer',
      featured: true,
      order: 1,
    },
    {
      title: 'Data Structure Library',
      description:
        'A comprehensive C++ library implementing advanced data structures with emphasis on performance and memory efficiency.',
      technologies: 'C++, CMake, Google Test',
      githubUrl: 'https://github.com/professor/ds-library',
      featured: true,
      order: 2,
    },
    {
      title: 'Complexity Analysis Tool',
      description:
        'Automated tool for analyzing time and space complexity of algorithms through static code analysis.',
      technologies: 'Python, LLVM, AST',
      githubUrl: 'https://github.com/professor/complexity-tool',
      featured: false,
      order: 3,
    },
    {
      title: 'Graph Kernel Toolkit',
      description:
        'A research toolkit for experimenting with graph kernels and similarity metrics.',
      technologies: 'TypeScript, Node.js, WebGL',
      githubUrl: 'https://github.com/professor/graph-kernel-toolkit',
      featured: false,
      order: 4,
    },
    {
      title: 'Persistent Data Structures Lab',
      description: 'Interactive demonstrations of persistent arrays, stacks, and trees.',
      technologies: 'Next.js, TypeScript, SVG',
      githubUrl: 'https://github.com/professor/persistent-ds-lab',
      featured: true,
      order: 5,
    },
  ]

  for (const project of projects) {
    await prisma.project.create({ data: project })
  }

  const achievements = [
    {
      title: 'Distinguished Teaching Award',
      description: 'Recognized for excellence in undergraduate computer science education',
      year: 2023,
      institution: 'University Computer Science Department',
      type: 'award',
      order: 1,
    },
    {
      title: 'Best Paper Award',
      description: 'ACM Symposium on Theory of Computing',
      year: 2022,
      institution: 'ACM',
      type: 'award',
      order: 2,
    },
    {
      title: 'NSF Research Grant',
      description: 'Funded research on efficient algorithms for big data processing',
      year: 2021,
      institution: 'National Science Foundation',
      type: 'grant',
      order: 3,
    },
    {
      title: 'IEEE Senior Member',
      description: 'Recognized for contributions to algorithm engineering and education',
      year: 2020,
      institution: 'IEEE',
      type: 'award',
      order: 4,
    },
    {
      title: 'Best Dissertation Advisor',
      description: 'Awarded for mentorship of doctoral candidates',
      year: 2019,
      institution: 'Graduate School',
      type: 'award',
      order: 5,
    },
  ]

  for (const achievement of achievements) {
    await prisma.achievement.create({ data: achievement })
  }

  const qas = [
    {
      question: 'What are your current research interests?',
      answer:
        'My current research focuses on dynamic graph algorithms, cache-efficient data structures, and the theoretical foundations of efficient computation. I am particularly interested in developing algorithms that perform well on modern hardware with complex memory hierarchies.',
      category: 'Research',
      order: 1,
    },
    {
      question: 'How can I get involved in research as an undergraduate student?',
      answer:
        'I encourage motivated undergraduates to reach out via email with their interests and background. I typically have openings for research assistants each semester. Prior coursework in algorithms and data structures is essential, and programming experience is highly valued.',
      category: 'Students',
      order: 2,
    },
    {
      question: 'What programming languages do you recommend for algorithm implementation?',
      answer:
        'For learning algorithms, I recommend starting with Python due to its readability and extensive libraries. For production implementations where performance matters, C++ is often the best choice. Java is also excellent for understanding object-oriented design of data structures.',
      category: 'Teaching',
      order: 3,
    },
    {
      question: 'How do you select research topics for graduate students?',
      answer:
        'I look for problems that balance theoretical depth with practical relevance. We typically start with foundational questions in data structures and then evaluate feasibility against current literature.',
      category: 'Research',
      order: 4,
    },
    {
      question: 'Do you collaborate with industry labs?',
      answer:
        'Yes, we collaborate on projects that align with algorithmic performance and scalability concerns. These are typically short-term engagements with clear research outputs.',
      category: 'Collaboration',
      order: 5,
    },
  ]

  for (const qa of qas) {
    await prisma.qA.create({ data: qa })
  }

  await prisma.contact.upsert({
    where: { id: '1' },
    update: {
      email: 'professor@university.edu',
      phone: '+1 (555) 123-4567',
      office: 'Computer Science Building, Room 301',
      officeHours: 'Monday & Wednesday, 2:00 PM - 4:00 PM',
      linkedin: 'https://linkedin.com/in/professor',
      github: 'https://github.com/professor',
      twitter: 'https://twitter.com/professor',
      googleScholar: 'https://scholar.google.com/citations?user=professor',
    },
    create: {
      id: '1',
      email: 'professor@university.edu',
      phone: '+1 (555) 123-4567',
      office: 'Computer Science Building, Room 301',
      officeHours: 'Monday & Wednesday, 2:00 PM - 4:00 PM',
      linkedin: 'https://linkedin.com/in/professor',
      github: 'https://github.com/professor',
      twitter: 'https://twitter.com/professor',
      googleScholar: 'https://scholar.google.com/citations?user=professor',
    },
  })

  const settings = [
    { key: 'siteTitle', value: 'Data Structures & Algorithms' },
    { key: 'professorName', value: 'Dr. John Smith' },
    { key: 'professorTitle', value: 'Professor of Computer Science' },
    { key: 'university', value: 'University of Computer Science' },
    { key: 'department', value: 'Department of Computer Science' },
    { key: 'heroHeadline', value: 'Data Structures\n& Algorithms' },
    {
      key: 'heroSubheadline',
      value:
        'Exploring the fundamental principles that power modern computing through research, teaching, and innovation.',
    },
    { key: 'heroPrimaryCtaLabel', value: 'View Research Papers' },
    { key: 'heroPrimaryCtaLink', value: '#research' },
    { key: 'heroSecondaryCtaLabel', value: 'Get in Touch' },
    { key: 'heroSecondaryCtaLink', value: '#contact' },
    { key: 'cvUrl', value: '/uploads/cv.pdf' },
    { key: 'footerText', value: 'Professor of Data Structures & Algorithms' },
    { key: 'profileImageUrl', value: '' },
    { key: 'yearsTeaching', value: '15' },
    { key: 'studentsMentored', value: '200' },
    { key: 'awardsCount', value: '10' },
  ]

  for (const setting of settings) {
    await prisma.siteSetting.upsert({
      where: { key: setting.key },
      update: { value: setting.value },
      create: setting,
    })
  }

  console.log('Seed data created successfully')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
