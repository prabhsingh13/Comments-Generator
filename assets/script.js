document.addEventListener('DOMContentLoaded', function () {
  const generateBtn = document.getElementById('generateBtn')
  const numberInput = document.getElementById('number')
  const commentForm = document.getElementById('commentForm')
  const resultTextArea = document.getElementById('commentResult')
  const copyBtn = document.getElementById('copyBtn')

  generateBtn.addEventListener('click', function () {
    const numComments = parseInt(numberInput.value)
    if (!numComments || numComments <= 0) {
      // Show SweetAlert with the number of comments generated
      Swal.fire({
        icon: 'warning',
        title: 'Enter Valid Value!!',
        text: 'Please enter a valid number of comments.',
      })
      return
    }

    // Get selected comment types
    const selectedTypes = []
    commentForm.querySelectorAll('button[id^="type"]').forEach((button) => {
      if (button.classList.contains('active')) {
        selectedTypes.push(button.dataset.type)
      }
    })

    // Fetch comments from selected JSON files
    Promise.all(
      selectedTypes.map((type) => {
        return fetch(`./database/type${type}.json`)
          .then((response) => response.json())
          .then((data) => data.comments)
      })
    )
      .then((commentArrays) => {
        const allComments = commentArrays.flat() // Flatten the array of arrays
        const selectedComments = getRandomComments(allComments, numComments)
        resultTextArea.value = selectedComments.join('\n')
        copyBtn.disabled = false // Enable the copy button

        const Toast = Swal.mixin({
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          didOpen: (toast) => {
            toast.onmouseenter = Swal.stopTimer
            toast.onmouseleave = Swal.resumeTimer
          },
        })
        Toast.fire({
          icon: 'success',
          title: `${selectedComments.length} comments generated.`,
        })
      })
      .catch((error) => {
        console.error('Error fetching comments:', error)
        // Show SweetAlert with the number of comments generated
        Swal.fire({
          icon: 'warning',
          title: 'Error Fetching Comments!!',
          text: 'An error occurred while fetching comments. Please try again later.',
        })
      })
  })

  copyBtn.addEventListener('click', function () {
    resultTextArea.select()
    document.execCommand('copy')
    const Toast = Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.onmouseenter = Swal.stopTimer
        toast.onmouseleave = Swal.resumeTimer
      },
    })
    Toast.fire({
      icon: 'success',
      title: 'Comments copied to clipboard!',
    })
  })

  // Add click event listeners to comment type buttons
  commentForm.querySelectorAll('button[id^="type"]').forEach((button) => {
    button.addEventListener('click', function () {
      button.classList.toggle('active')
    })
  })

  function getRandomComments(comments, num) {
    const shuffledComments = comments.sort(() => 0.5 - Math.random())
    return shuffledComments.slice(0, num)
  }
})
