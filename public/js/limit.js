document.addEventListener('DOMContentLoaded', () => {
  const array = [];
  const limits = [];
  const elements = document.querySelectorAll('.vLimit');
  elements.forEach(ele => {
    limits.push(Number(ele.value));
    array.push([]);
  });

  const length = document.querySelectorAll('.vLimit').length;
  for (let i = 0; i < length; i++) {
    let t = '.cName' + i;
    let count = document.querySelectorAll(t);
    count.forEach(ele => {
      ele.addEventListener('click', (e) => {
        // let parent = e.target.parentNode;
        // let forAttribue = parent.getAttribute('for');
        // let i = Number(forAttribue[forAttribue.length - 2]);
        // let j = Number(forAttribue[forAttribue.length - 1]);
        const i = Number(ele.getAttribute('postid'))
        const j = Number(ele.getAttribute('candidateid'))
        if (e.target.checked) {
          array[i].push(j);
          if (array[i].length > limits[i]) {
            let k = array[i].shift();
            let d = document.querySelector('#post' + i + 'candidate' + k);
            d.checked = false;
          }
        } else {
          let index = array[i].indexOf(j);
          if (index !== -1) {
            array[i].splice(index, 1);
          }
        }
        });
    });
  }


  document.querySelector('#submitbtn').addEventListener('click', (e) => {
    let err = false;
    let msg = '';
    for(let i = 0; i < limits.length; i++) {
      let count = document.querySelectorAll(`.cName${i}:checked`).length;
      if (count < limits[i]) {
        let ele = document.querySelector(`.cName${i}`).parentNode.parentNode.parentNode;
        ele = ele.firstElementChild;
        msg += `Select ${limits[i]} ${limits[i] > 1 ? `candidates`:`candidate`} from ${ele.textContent}. <br>`;
        err = true;
      }
    }
    e.preventDefault();
    const sound = new Audio();
    if (err) {
      let node = document.querySelector('#err');
      node.innerHTML = `<b>${msg}</b>`;
      sound.src = '/audio/beepError.mp3';
      sound.play();
    } else {
      sound.src = '/audio/beepSuccess.mp3';
      sound.play();
      setTimeout(() => { document.forms['electionVoting'].submit(); }, 700);
    }
  });
});