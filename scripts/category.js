let allCategoryPosts = [];

function renderPost(post) {

  
    const postContainer = document.getElementById('categoryPosts')

    const postElement = document.createElement('div')
    postElement.classList.add('post')
    postElement.id = post.id
    postContainer.appendChild(postElement)
    
    const authorContainer = document.createElement('div')
    authorContainer.classList.add('post__author')
    postElement.appendChild(authorContainer)


    const categoryElement = document.createElement('div')
    categoryElement.classList.add('post__category')
    
   
    /* --- AUTHOR --- */

     
    const author = post.author;     
    const authorAvatar = document.createElement('img')
    
    authorAvatar.classList.add('post_author-image')
    

    authorAvatar.src = author.avatar
        
  
      
   
    authorContainer.appendChild(authorAvatar)
    const authorName = document.createElement('a')
    authorName.classList.add('post_author-name')
    authorName.href = author.link
    authorName.textContent = `${author.name}`
    authorContainer.appendChild(authorName)

    authorContainer.appendChild(categoryElement)
     

 

     /* --- CATEGORY --- */
    const categories = post.categories;

    categories.slice(0, 2).forEach((category) => {
        const linkCategory = document.createElement('a')
        linkCategory.classList.add('post_category-link')
        linkCategory.href = category.link
        categoryElement.appendChild(linkCategory)

        const textCategory = document.createElement('span')
        textCategory.classList.add('post__category-item')
        textCategory.textContent = category.name
        linkCategory.appendChild(textCategory)
    })

    


        


    /* --- DATE --- */


    const date = new Date(post.date);    

    const formattedDate = `${date.getDate().toString().padStart(2, '0')}.${(date.getMonth() + 1)
        .toString()
        .padStart(2, '0')}.${date.getFullYear()}`;

    const dateElement = document.createElement('time')
    dateElement.classList.add('post__date')  
    dateElement.textContent = formattedDate;
    categoryElement.appendChild(dateElement)  
    
    
    /* --- TITLE --- */

    const title = document.createElement('h2')
    title.classList.add('post__title')
    postElement.appendChild(title)
    
    const titleLink = document.createElement('a')
    titleLink.href = post.link
    titleLink.textContent = post.title
    title.appendChild(titleLink)


    
    /* --- EXCERPT --- */
    const excerpt = document.createElement('div')
    excerpt.classList.add('post__excerpt')
    postElement.appendChild(excerpt)


    let fullContent = post.description
        .replace(/<[^>]*>/g, '') 
        .replace(/\r?\n|\r/g, ' ') 
        .replace(/\s+/g, ' ') 
        .trim();  

    const extendedExcerpt = fullContent.split(' ').slice(0, 27).join(' ') + '...' 
    
    excerpt.innerHTML = `${extendedExcerpt}`

    /* --- IMAGE --- */

    const thumbnail = document.createElement('div')
    thumbnail.classList.add('post__thumbnail')
    postElement.appendChild(thumbnail)

    const imageLink = document.createElement('a')
    imageLink.href = post.link
    thumbnail.appendChild(imageLink)

    

    const image = document.createElement('img')
    image.src = post.image
    imageLink.appendChild(image)
     
    
    
    
}


async function fetchPosts() {
    try {
        const response = await fetch('https://journal.zennolab.com/wp-json/wp/v2/posts?categories=25');
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const posts = await response.json();

        // All data
        allCategoryPosts = await Promise.all(posts.map(async (post) => {

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

        allCategoryPosts.forEach((post) => {
            renderPost(post)
        })
    } catch (error) {
        console.error('Ошибка при получении данных:', error);
    }
}

const searchPost = (query) => {
    const filteredPost = allCategoryPosts.filter(post => 
        post.title.toLowerCase().includes(query.toLowerCase())
    );
    const postContainer = document.getElementById('categoryPosts')
    postContainer.innerHTML = '';
    
    
    filteredPost.forEach(post => {
        renderPost(post);
      });
    
  }
  
  document.querySelector('.container').style.display = 'block'
  document.querySelector('.loader-block').style.display = 'none'
  
  document.getElementById('searchInputCategory').addEventListener('input', (event) => {
    const query = event.target.value.trim();
    searchPost(query);

    
  })

fetchPosts();

document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('3437').querySelector(".post__title a").href = '/zennolab-homepage/page/publication/';
  });
  