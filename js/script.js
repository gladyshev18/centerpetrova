const exercise = {
  init: function () {
    const answerButtons = document.querySelectorAll(".answers button");
    for (let i = 0; i < answerButtons.length; i++) {
      answerButtons[i].addEventListener("click", function () {
        exercise.setAnswer(this);
      });
    }

    const answerInputs = document.querySelectorAll(".input-phrase input");
    for (let i = 0; i < answerInputs.length; i++) {
      answerInputs[i].addEventListener("click", function () {
        if (this.classList.contains("selected")) {
          exercise.deleteAnswer(this);
        }
      });
    }
  },

  setAnswer: function (answer) {
    let slide = answer.closest(".exercise-slide");
    let index = exercise.getCurrentAnswerIndex(answer);

    if (index != -1) {
      const answerInputs = slide.querySelectorAll(".input-phrase input");
      answerInputs[index].value = answer.innerText;
      answerInputs[index].setAttribute(
        "style",
        `width: calc(${answer.innerText.length} * 33px)`
      );
      answerInputs[index].classList.add("selected");
      answer.classList.add("selected");
      exercise.submit(answer);
    }
  },

  deleteAnswer: function (answer) {
    const slide = answer.closest(".exercise-slide");
    let value = answer.value;
    answer.value = "";
    answer.classList.remove("selected");
    answer.classList.remove("incorrect");
    answer.classList.remove("correct");

    let button = slide.querySelector(`.answers button[data-text="${value}"]`);
    button.classList.remove("selected");
    let letters = answer.getAttribute("data-letters");
    answer.setAttribute("style", `width: calc(${letters} * 33px)`);
  },

  getCurrentAnswerIndex: function (self) {
    const slide = self.closest(".exercise-slide");
    const answerInputs = slide.querySelectorAll(".input-phrase input");
    let index = 0;
    let full = false;
    for (let i = 0; i < answerInputs.length; i++) {
      if (answerInputs[i].value == "") {
        index = i;
        full = true;
        break;
      }
    }
    if (!full) {
      index = -1;
    }
    return index;
  },

  submit: function (self) {
    const slide = self.closest(".exercise-slide");
    const answerInputs = slide.querySelectorAll(".input-phrase input");
    const answer = [];
    for (let i = 0; i < answerInputs.length; i++) {
      answer.push({
        text: answerInputs[i].value,
        index: i,
      });
    }
    fetch("./js/success.json")
      .then((response) => response.json())
      .then((data) => {
        let input;
        for (let i = 0; i < data.length; i++) {
          input = answerInputs[data[i]["index"]];
          if (data[i]["status"] == true && input.value != "") {
            input.classList.add("correct");
          }
          if (data[i]["status"] == false && input.value != "") {
            input.classList.add("incorrect");
          }
        }
      });
  },
};

const feedback = {
  submit: function (form) {
    const data = new FormData(form);

  },

  validate: function (form) {
    const email = form.querySelector("input[name='email']");

    if (!email.value.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      const fieldEmail = email.closest(".field-wrapper")
      fieldEmail.classList.add("error");
      fieldEmail.querySelector(".field-error").innerText = "Пожалуйста, заполните обязательные поля!";
      email.addEventListener("focus", function (e) {
        fieldEmail.classList.remove("error");
        fieldEmail.querySelector(".field-error").innerText = "";  
      });
      return false;
    }

    return true;
  },
};

document.addEventListener("DOMContentLoaded", function () {
  //
  exercise.init();

  const swiper = new Swiper(".exercises-slider", {
    loop: true,
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
    },
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
  });

  const feedbackForm = document.querySelector(".feedback-form form");
  feedbackForm.addEventListener("submit", function (e) {
    e.preventDefault();
    if (feedback.validate(this)) {
      feedback.submit(this);
    }
  });
});
