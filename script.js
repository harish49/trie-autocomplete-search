class TrieNode {
  constructor() {
    this.children = [];
    this.words = [];
  }
}
class Trie {
  constructor() {
    this.root = new TrieNode();
    this.suggestedWords = [];
  }
  insert(word, pos) {
    let curr = this.root;
    for (let i = 0; i < word.length; i++) {
      if (curr.children[word.charCodeAt(i)] === undefined) {
        curr.children[word.charCodeAt(i)] = new TrieNode();
      }
      curr = curr.children[word.charCodeAt(i)];
    }
    curr.words.push(pos);
  }

  prefix(word, rootNode, curr) {
    if (word !== undefined && word.length === 0 && curr.length === 0) {
      return;
    }
    if (
      rootNode !== undefined &&
      word.length === 0 &&
      rootNode.words !== undefined &&
      rootNode.words.length >= 1
    ) {
      this.suggestedWords.push([...rootNode.words]);
    }

    for (let i = 0; i < rootNode.children.length; i++) {
      if (
        ((word.length >= 1 && i == word.charCodeAt(0)) ||
          (curr.length >= 1 && word.length === 0)) &&
        rootNode.children[i] !== undefined
      ) {
        this.prefix(
          word.substring(1),
          rootNode.children[i],
          curr + String.fromCharCode(i)
        );
      }
    }
  }
}

const trie = new Trie();
const searchItem = document.getElementById("search-item");
const searchResult = document.getElementById("search-result");

function preprocess() {
  for (let i = 0; i < movieData.length; i++) {
    trie.insert(movieData[i].title.toLowerCase(), i);
  }
}
preprocess();
function processRequest(word) {
  trie.prefix(word.toLowerCase(), trie.root, "");
  parseToHTML(trie.suggestedWords);
  trie.suggestedWords = [];
}

function parseToHTML(suggestions) {
  if (suggestions.length > 0) {
    suggestions = suggestions.slice(0, Math.min(11, suggestions.length));
    const parsedHTML = suggestions
      .filter(
        (movie) =>
          movieData[movie] !== undefined &&
          movieData[movie].title !== undefined &&
          movieData[movie].poster !== undefined
      )
      .map(
        (movie) =>
          `<div class="card card-body mb-1">
            <div class = "row">
                <div class ="col">
                    <img src="${movieData[movie].poster}" height="60" width="65" class = "rounded"/>
                </div>
            <div class = "col">
               <a href = "https://www.google.com/search?q=${movieData[movie].title}" target="_blank" style="text-decoration: none;"> <h4 style="color:black;">${movieData[movie].title}</h4></a>
            </div>
            <div class = "col">

            </div>
            </div>
        </div>`
      )
      .join("");
    searchResult.innerHTML = parsedHTML;
  } else {
    searchResult.innerHTML = "";
  }
}
searchItem.addEventListener("input", () => processRequest(searchItem.value));
