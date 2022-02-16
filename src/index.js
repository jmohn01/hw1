import Model from './model.js';

const model = new Model();

window.onload = function () {

  switch (location.hash) {
    case "#Questions":
      populateQuestions(model.getQuestions(), model.getTags());
      break;
    case "#Tags":
      populateTags(model.getTags(), model.getQuestions());
      break;
    case "#AskAQuestion":
      openAskQuestion();
      break;
    default:
      populateQuestions(model.getQuestions(), model.getTags());
      break;
  }
};

window.refresh = () => {
  populateQuestions(model.getQuestions(), model.getTags());
}

window.fetchAnswers = (qid) => {
  model.addView(qid);
  const question = model.getQuestion(qid);
  const answers = question.answers.map(aid => model.getAnswer(aid));
  populateAnswers(question, answers);
}

window.filterQuestions = (criteria, terms, category) => {
  if (criteria === 'tags') {
    const questions = model.getQuestions().filter(question => {
      const tags = question.tagIds.map(tag => model.getTags().find(t => t.tid === tag).name);
      let present = false;
      terms.forEach(term => {
        if (tags.includes(term)) present = true;
      });
      return present;
    });

    populateQuestions(questions, model.getTags(), category);
  } else {
    const questions = model.getQuestions().filter(question => {
      let present = false;
      terms.split(" ").forEach(term => {
        if (question.title.toLowerCase().includes(term.toLowerCase())) present = true;
      });
      return present;
    });

    populateQuestions(questions, model.getTags(), category);
  }
}

window.storeQuestion = (title, text, tags, username) => {
  const today = new Date();

  const newQuestion = {
    qid: `q${model.getQuestionsLength() + 1}`,
    title: title,
    text: text,
    tagIds: tags.map(tag => storeTag(tag)),
    askedBy: username,
    askedOn: `${getMonth(today.getMonth())} ${today.getDate()}, ${today.getFullYear()}`,
    askedAt: `${today.getHours()}:${today.getMinutes()}`,
    answers: [],
    views: 0,
  };
  model.addQuestion(newQuestion);

  populateQuestions(model.getQuestions(), model.getTags()); // refresh the view
}

window.storeTag = (name) => {
  const existing = model.getTags().find(tag => tag.name === name);

  if (existing) return existing.tid;

  const tagId = `t${model.getTagsLength() + 1}`;

  const newTag = {
    tid: tagId,
    name: name,
  };

  model.addTag(newTag);
  return tagId;
}

window.storeAnswer = (qid, text, username) => {
  const today = new Date();

  const answer = {
    aid: `a${model.getAnswersLength() + 1}`,
    text: text,
    ansBy: username,
    ansOn: `${getMonth(today.getMonth())} ${today.getDate()}, ${today.getFullYear()}`,
    ansAt: `${today.getHours()}:${today.getMinutes()}`
  }

  model.addAnswer(answer, qid);
  populateAnswers(model.getQuestion(qid), model.getQuestion(qid).answers.map(aid => model.getAnswer(aid)));
}

window.getMonth = (number) => {
  let month = '';

  switch (number) {
    case 0:
      month = 'Jan';
      break;
    case 1:
      month = 'Feb';
      break;
    case 2:
      month = 'Mar';
      break;
    case 3:
      month = 'Apr';
      break;
    case 4:
      month = 'May';
      break;
    case 5:
      month = 'Jun';
      break;
    case 6:
      month = 'Jul';
      break;
    case 7:
      month = 'Aug';
      break;
    case 8:
      month = 'Sep';
      break;
    case 9:
      month = 'Oct';
      break;
    case 10:
      month = 'Nov';
      break;
    case 11:
      month = 'Dec';
      break;
  }

  return month;
}

window.fetchTags = () => populateTags(model.getTags(), model.getQuestions());
