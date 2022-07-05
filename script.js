document.addEventListener('DOMContentLoaded', () => {

  // Upload & read
  const uploadBtn = document.getElementById('upload-json');
  uploadBtn.addEventListener('click', async () => {
    const file = document.querySelector('input[type=file]').files[0];
    if (!file) {
      alert("No file selected");
    } else {
      const result = await readJSON(file);
      renderJSON(result);
      setItemsListeners();
    }
  });

  // Expand/Collapse All
  const expand = document.getElementById('expand');
  expand.addEventListener('click', expandAll);
  const collapse = document.getElementById('collapse');
  collapse.addEventListener('click', collapseAll);
});


function readJSON(file) {
  return new Promise((resolve, reject) => {
    const jsonReader = new FileReader();
    if (file) jsonReader.readAsText(file);
    jsonReader.addEventListener('load', () => {
      const data = jsonReader.result;
      const json = JSON.parse(data);
      resolve(json);
    });
  });
}

function renderJSON(json) {
  const root = document.querySelector('ul#root');
  root.innerHTML = '';
  json.forEach((item, index) => {
    const itemTitle = document.createElement('li');
    let value = "";
    if (typeof Object.values(item)[0] != 'object') {
      value = Object.values(item)[0];
    }
    itemTitle.innerHTML = `<span class="item-title key">${index} ${value}</span>`;
    const htmlItem = renderItem(item);
    itemTitle.appendChild(htmlItem);
    root.appendChild(itemTitle);
  });
}



function renderItem(item) {
  let htmlItem = document.createElement('ul');

  for (key in item) {
    const subItem = document.createElement('li');
    if (typeof item[key] != "object" || item[key].length == 0) {
      subItem.innerHTML = `<span class="key">${key}</span> : <span class="${typeof item[key]}">${item[key]}</span>`;
      htmlItem.appendChild(subItem);
    } else {
      const subItemTitle = document.createElement('li');
      let itemLength;
      if (Array.isArray(item[key])) {
        itemLength = item[key].length;
      } else {
        itemLength = Object.keys(item[key]).length;
      }
      subItemTitle.innerHTML = `<span class="item-title key">${key} (${itemLength})</span>`;
      const subItem = renderItem(item[key]);
      subItemTitle.appendChild(subItem);
      htmlItem.appendChild(subItemTitle);
    }
  }

  return htmlItem;
}

function setItemsListeners() {
  const listItems = document.querySelectorAll('.item-title');
  listItems.forEach(item => {
    item.addEventListener('click', () => {
      item.parentElement.classList.toggle('open');
    });
  });
}

function expandAll() {
  const elements = document.querySelectorAll('li > ul');
  elements.forEach(el => el.parentElement.classList.add('open'));
}

function collapseAll() {
  const elements = document.querySelectorAll('li > ul');
  elements.forEach(el => el.parentElement.classList.remove('open'));
}
