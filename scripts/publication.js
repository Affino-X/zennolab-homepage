let allPosts = [];


function renderPost(post, target, isPublic = true) {

  
    const postContainer = document.getElementById(target)

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
    
    if(!isPublic) {
        const titleLink = document.createElement('a')
        titleLink.href = post.link
        titleLink.textContent = post.title
        title.appendChild(titleLink)
    } else {
        title.textContent = post.title
    }


    
    /* --- EXCERPT --- */
    const excerpt = document.createElement('div')
    excerpt.classList.add('post__excerpt')
    postElement.appendChild(excerpt)


    let fullContent = post.description
        .replace(/<[^>]*>/g, '') 
        .replace(/\r?\n|\r/g, ' ') 
        .replace(/\s+/g, ' ') 
        .trim();  

    const extendedExcerpt = fullContent.split(' ').slice(0, 27).join(' ') 
    
    excerpt.innerHTML = `${extendedExcerpt}`

    /* --- IMAGE --- */

    const thumbnail = document.createElement('div')
    thumbnail.classList.add('post__thumbnail')
    postElement.appendChild(thumbnail)

    if(!isPublic) {
        const imageLink = document.createElement('a')
        imageLink.href = post.link
        thumbnail.appendChild(imageLink)

        const image = document.createElement('img')
        image.src = post.image
        imageLink.appendChild(image)
    } else {
        const image = document.createElement('img')
        image.src = post.image
        thumbnail.appendChild(image)
    }

    

    
     
    
    
    
}

function renderPostSingle(post) {

    const postThumb = document.getElementById('postSingle').querySelector('.post__thumbnail')
    const content = document.createElement('div')
    content.classList.add('post__content')
    postThumb.insertAdjacentElement('afterend', content)
    
    let fullContent = post.description
        .replace(/<[^>]*>/g, '') 
        .replace(/\r?\n|\r/g, ' ') 
        .replace(/\s+/g, ' ') 
        .trim();  

    const extendedExcerpt = fullContent.split(' ').slice(0, 27).join(' ') 

    const regex = new RegExp(extendedExcerpt, 'g'); // Регулярное выражение для поиска текста
    const newContnet = post.description.replace(regex, '').trim(); 

    content.innerHTML = newContnet

    const commentBlock = document.createElement('div')
    commentBlock.classList.add('comment-box')
    content.insertAdjacentElement('afterend', commentBlock)

    const commentCount = document.createElement('div') 
    commentCount.classList.add('comment-box__count')

    commentBlock.appendChild(commentCount)
    
    const commentIcon = document.createElement('img')
    commentIcon.src = 'http://journal.zennolab.com/wp-content/uploads/2024/12/comment.svg'

    commentCount.appendChild(commentIcon)

    const commentNum = document.createElement('span')
    commentNum.textContent = `${post.comments.length} комментариев`

    commentCount.appendChild(commentNum)

    const shareBox = document.createElement('div')
    shareBox.classList.add('share-box')

    commentBlock.appendChild(shareBox)


    const shareText = document.createElement('span')
    shareText.classList.add('share-text')
    shareText.textContent = 'Поделиться:'
    shareBox.appendChild(shareText)

    const shareLink = document.createElement('span')
    shareLink.classList.add('share-link')
    shareBox.appendChild(shareLink)

    const links = [
        [`https://t.me/share/url?url=https%3A%2F%2Fjournal.zennolab.com%2F${post.slug}%2F&roistat_visit=952766`, `http://journal.zennolab.com/wp-content/uploads/2024/12/telegram.svg`],
        [`https://x.com/intent/post?url=https%3A%2F%2Fjournal.zennolab.com%2F${post.slug}%2F&roistat_visit=952766`, `http://journal.zennolab.com/wp-content/uploads/2024/12/vkontakte-1.svg`],
        [`https://vk.com/share.php?url=https%3A%2F%2Fjournal.zennolab.com%2F${post.slug}%2F&roistat_visit=952766`, `http://journal.zennolab.com/wp-content/uploads/2024/12/twitter.svg`]
    ]

    links.forEach(element => {
        const shareAnchor = document.createElement('a')
        shareAnchor.href = element[0]
        shareLink.appendChild(shareAnchor)

        const shareIcon = document.createElement('img')
        shareIcon.src = element[1]
        shareAnchor.appendChild(shareIcon)
    });


    commentBlock.insertAdjacentHTML('afterend', `<div class="post-comments no-comment-yet penci-comments-hide-0" id="comments">
		<div id="respond" class="pc-comment-normal">
		<h3 id="reply-title" class="comment-reply-title"><span>Оставить комментарий</span> <small><a rel="nofollow" id="cancel-comment-reply-link" href="/glavnye-trendy-v-seo-v-2025-godu/#respond" style="display:none;">Cancel Reply</a></small></h3><form action="https://journal.zennolab.com/wp-comments-post.php" method="post" id="commentform" class="comment-form"><p class="comment-form-comment"><textarea id="comment" name="comment" cols="45" rows="8" placeholder="Ваш комментарий" aria-required="true"></textarea></p><p class="comment-form-author"><input id="author" name="author" type="text" value="" placeholder="Имя*" size="30" aria-required="true"></p>
<p class="comment-form-email"><input id="email" name="email" type="text" value="" placeholder="Email*" size="30" aria-required="true"></p>
<p class="comment-form-url"><input id="url" name="url" type="text" value="" placeholder="сайт" size="30"></p>
<p class="comment-form-cookies-consent"><input id="wp-comment-cookies-consent" name="wp-comment-cookies-consent" type="checkbox" value="yes"><span class="comment-form-cookies-text" for="wp-comment-cookies-consent">Сохранить данные в браузере для последующих комментариев</span></p>
<p class="form-submit"><input name="submit" type="submit" id="submit" class="submit" value="Добавить"> <input type="hidden" name="comment_post_ID" value="${post.id}" id="comment_post_ID">
<input type="hidden" name="comment_parent" id="comment_parent" value="0">
</p></form>	</div><!-- #respond -->
	</div>`)


}



async function fetchPosts() {
    try {
        const response = await fetch('https://journal.zennolab.com/wp-json/wp/v2/posts?per_page=100');
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const posts = await response.json();

        // All data
        allPosts = await Promise.all(posts.map(async (post) => {

            // Get data author
            const authorResponse = await fetch(`https://journal.zennolab.com/wp-json/wp/v2/users/${post.author}`);
            const authorData = await authorResponse.json();

            const commentResponse = await fetch(`https://journal.zennolab.com/wp-json/wp/v2/comments/?post=${post.id}`);
            const commentData = await commentResponse.json();

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
                slug: post.slug,  
                title: post.title.rendered,
                image: imageURL,
                comments: commentData,
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





async function main() {
    await fetchPosts();

    let postStart = 0; 
    let postCount = 1;
    const loadIncrement = 9; 
    const postId = 3167;

    const renderPosts = () => {
        const posts = allPosts.slice(postStart, postStart + postCount);
        posts.forEach((post) => renderPost(post, 'postMore'));
        postStart += postCount;

        if (postCount === postCount) {
            postCount = loadIncrement;
        }

        
        if (postStart >= allPosts.length) {
            document.getElementById('loadMoreSingle').style.display = 'none';
        }
    };

    
    document.getElementById('loadMoreSingle').addEventListener('click', renderPosts);

    console.log(allPosts)
    
    const recentArticle = allPosts.find(post => post.id === postId)
    

    renderPosts();
    renderPost(recentArticle, 'postSingle', true)
    renderPostSingle(recentArticle)

    document.querySelector('.container').style.display = 'block'
    document.querySelector('.loader-block').style.display = 'none'
}

main().catch((error) => console.error('Error loading posts:', error));

