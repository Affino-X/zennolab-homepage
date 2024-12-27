let allPosts = [];


async function fetchPosts() {
    try {
        const response = await fetch('https://journal.zennolab.com/wp-json/wp/v2/posts?author=4&per_page=100');
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const posts = await response.json();

        // All data
        allPosts = await Promise.all(posts.map(async (post) => {

            // Get data author
            const authorResponse = await fetch(`https://journal.zennolab.com/wp-json/wp/v2/users/${post.author}`);
            const authorData = await authorResponse.json();

            // Get image
            const imageResponse = await fetch(`https://journal.zennolab.com/wp-json/wp/v2/media/${post.featured_media}`);
            const imageData = await imageResponse.json();
            const imageURL = imageData.source_url; 

            // Get categories
            const categories = await Promise.all(
                post.categories.map(async (categoryId) => {
                    const categoryResponse = await fetch(`https://journal.zennolab.com/wp-json/wp/v2/categories/${categoryId}`);
                    const categoryData = await categoryResponse.json();
                    return {name: categoryData.name, link: categoryData.link}; 
                })
            );
            
            return {
                id: post.id,    
                title: post.title.rendered,
                image: imageURL,
                excerpt: post.excerpt.rendered,
                description: post.content.rendered,
                date: post.date,
                link: post.link,
                categories: categories,
                author: {
                    name: authorData.name,
                    avatar: authorData.penci_avatar?.['96'] != null ? authorData.penci_avatar?.['96'] : authorData.avatar_urls?.['96'],
                    link: authorData.link
                },
            };
        }));

        
        
    } catch (error) {
        console.error('Ошибка при получении данных:', error);
    }
}


const renderLatestPost = (post) => {
    const latestPostMain = document.getElementById("latestPostMain")

    latestPostMain.innerHTML = 
    (`
      
        <img src="${post.image}" alt="Main Post Image" class="latest-post-main__image" />
     
        <div class='shadow'></div>
        <a href="${post.link}" class="latest-post-main__link">
        </a>
        <h3 class="latest-post-main__title">
            <a href="${post.link}" class="latest-post-main__link-title">${post.title}</a>
        </h3>
      
      
     `
    )
}

const renderLatestPostWidget = (post) => {

    const latestPostWidget = document.getElementById("latestPostWidget")
    
    const latestPost = document.createElement('div')
    latestPost.classList.add('latest-post-widget__post')

    latestPostWidget.appendChild(latestPost)

    /* === CATEGORIES === */

    const categoriesBlock = document.createElement('div')
    categoriesBlock.classList.add('latest-post-widget__cateogries')
    latestPost.appendChild(categoriesBlock)


    post.categories.slice(0, 2).forEach((category) => {
        const categoryLink = document.createElement('a')
        categoryLink.classList.add('latest-post-widget__category-link')
        categoryLink.textContent = category.name
        categoryLink.href = category.link

        categoriesBlock.appendChild(categoryLink)
    })

    /* === TITLE === */
    const title = document.createElement('h3')
    title.classList.add('latest-post-widget__post-title')
    latestPost.appendChild(title)

    const titleLink = document.createElement('a')
    titleLink.textContent = post.title
    titleLink.href = post.link
    title.appendChild(titleLink)

    /* === AUTHOR AND DATE === */
    const span = document.createElement('span')
    latestPost.appendChild(span)

    const author = document.createElement('a')
    author.textContent = post.author.name
    author.href = post.author.link
    author.classList.add('latest-post-widget__post-author')

    const date = new Date(post.date);    

    const formattedDate = `${date.getDate().toString().padStart(2, '0')}.${(date.getMonth() + 1)
        .toString()
        .padStart(2, '0')}.${date.getFullYear()}`;

    const dateElement = document.createElement('time')
    dateElement.textContent = formattedDate;
    
    
    span.appendChild(author)
    span.appendChild(dateElement)
} 

const renderLastPublished = (post) => {
    const lastPublished = document.getElementById('lastPublished')

    lastPublished.innerHTML = 
    `
    <div class="last-published-block">
    <div class="last-published-overview">
        <img src="${post.image}" alt="">
    </div>
 
    <div class="last-published">
        <div class="last-published__author">
            <img src="${post.author.avatar}" alt="">
            <span>${post.author.name}</span>
        </div>
        <h2 class="last-published__title">
            ${post.title}
        </h2>
        <p class="last-published__content">
            Что такое бот для маркетплейсов? Бот для маркетплейсов — это программное решение, которое помогает автоматизировать задачи,…
        </p>
        <button class="last-published__button">Читать статью в блоге</button>
    </div>
    </div>
    
    `
}


async function main() {
    await fetchPosts();

    renderLastPublished(allPosts[0])

    renderLatestPost(allPosts[0])

    allPosts.slice(1, 5).forEach(post => {
        renderLatestPostWidget(post)
    });
    
}

main().catch((error) => console.error('Error loading posts:', error));
