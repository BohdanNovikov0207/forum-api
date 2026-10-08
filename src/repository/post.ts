import type { CreatePostInput } from "../service/post.types.js"
import type { Post } from "../domain/post/entity.js"

export function createPostRepository(){
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

  function getPostById(id: number) {
    const post = posts.find((p) => {
      return p.id === id
    })

    return post
  }


  function getAll(take?: number, category?: string){
      let selectedPosts = [...posts]

      if (category) {
          selectedPosts = selectedPosts.filter((post) => {
              return post.category === category
          })
      }

      if (take === undefined) {
          return selectedPosts
      }

      return selectedPosts.slice(0, take)
  }

  function createPost(newPostData: CreatePostInput) {
    return new Promise<Post>(function (resolve) {
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

  return {getPostById, getAll, createPost, posts}
}