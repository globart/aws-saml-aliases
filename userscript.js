// ==UserScript==
// @name        Fix-Missing-Aliases-AWS-SAML
// @description  Adds aliases in AWS SAML page to accounts that miss them
// @match       https://signin.aws.amazon.com/saml
// @grant       none
// @version     1.0
// ==/UserScript==

var accounts = {
  "123456789000": "Example Dev",
  "234567890000": "Example Prod",
};

var keys = Object.keys(accounts);

for (let i = 0; i < keys.length; i++) {
  var key = keys[i];
  var contains = `Account: ${key}`;

  var temp = document.querySelectorAll('.saml-account-name');

  for (let j = 0; j < temp.length; j++) {
    if (temp[j].textContent.includes(contains)) {
      var account = document.createElement("div");
      account.className = "saml-account-name";
      account.innerHTML = `${accounts[key]} <span class="account-number">#${key}</span>`;
      temp[j].outerHTML = account.outerHTML;
    }
  }
}
