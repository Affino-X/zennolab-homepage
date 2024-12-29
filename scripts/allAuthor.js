const renderAuthor = (author) => {

  const authorContainer = document.getElementById('authors')
  const authorBlock = document.createElement('div')
  authorBlock.classList.add('author')
  authorBlock.id = author.id
  authorContainer.appendChild(authorBlock)

  const authorInfo = document.createElement('div')
  authorInfo.classList.add('user-info')
  authorBlock.appendChild(authorInfo)

  const authorImg = document.createElement('img')
  authorImg.classList.add('user-info__avatar')
  authorImg.src = author.avatar
  authorInfo.appendChild(authorImg)

  const authorName = document.createElement('span')
  authorName.classList.add('user-info__name')
  authorName.textContent = author.name
  authorInfo.appendChild(authorName)

  const authorDesc = document.createElement('p')
  authorDesc.classList.add('user-info__desc')
  authorDesc.textContent = author.description
  authorBlock.appendChild(authorDesc)

}

/* --- COLLECTION DATA --- */

const allAuthors = [];

const fetchAuthors = async () => {
  try {
    const response = await fetch(`https://journal.zennolab.com/wp-json/wp/v2/users`);
    const authors = await response.json();

    
    allAuthors.length = 0;

    authors.forEach(({ id, name, penci_avatar, avatar_urls, description = "Описание отсутствует" }) => {
      allAuthors.push({
        id,
        name,
        avatar: penci_avatar?.['96'] != null ? penci_avatar?.['96'] : avatar_urls?.['96'],
        description
      });
    });
    allAuthors.reverse().forEach((author) => {
        renderAuthor(author)
    })
  } catch (error) {
    console.error("Ошибка при получении данных авторов:", error);
  }
}


const searchAuthor = (query) => {
  const filteredAuthors = allAuthors.filter(author => 
    author.name.toLowerCase().includes(query.toLowerCase())
  );
  const authorContainer = document.getElementById('authors')
  authorContainer .innerHTML = '';
  
  
    filteredAuthors.forEach(author => {
      renderAuthor(author);
    });
  
}


document.getElementById('searchInputAllAuthor').addEventListener('input', (event) => {
  const query = event.target.value.trim();
  searchAuthor(query);
})

fetchAuthors()





