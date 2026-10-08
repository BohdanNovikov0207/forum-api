import type { CreatePostRequest } from "../transport/dto/requests.js"

let posts = [
  {
    id: 0,
    title: 'First post',
    content: '4134gfdg5435',
    author: 'cat',
    category: 'general'
  },
  {
    id: 1,
    title: 'Second post',
    content: 'hytuytjgf',
    author: 'dog',
    category: 'programming'
  },
  {
    id: 2,
    title: 'Third post',
    content: 'njhgjytryh',
    author: 'meowdy',
    category: 'programming'
  }
]

export function getById(id: number) {
  const post = posts.find((p) => {
    return p.id === id
  })

  return post
}


export function getAll(take: string, category: string){
    let selectedPosts = [...posts]

    if (category) {
        selectedPosts = selectedPosts.filter((post) => {
            return post.category === category
        })
    }

    if (!take) {
        return selectedPosts
    }

    const takeNumber = parseInt(take, 10)

    return selectedPosts.slice(0, takeNumber)
}

export function addPost(newPostData: CreatePostRequest) {
  return new Promise(function (resolve) {
    const createdPost = {
      id: posts.length + 1,
      title: newPostData.title,
      content: newPostData.content,
      author: newPostData.author,
      category: newPostData.category
    }
    posts.push(createdPost)
    resolve(createdPost)
  })
}