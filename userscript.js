// ==UserScript==
// @name        Fix-Missing-Aliases-AWS-SAML
// @description  Adds aliases in AWS SAML page to accounts that miss them
// @match       https://signin.aws.amazon.com/saml
// @match       https://*.signin.aws.amazon.com/sessions/selector*
// @grant       none
// @version     1.1
// ==/UserScript==

var accounts = {
  "123456789000": "Example Dev",
  "234567890000": "Example Prod",
};

// Function to update account names on AWS SAML page
function updateSAMLPage() {
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
}

// Function to update account names on AWS session selector page
function updateSessionSelectorPage() {
  var divList = document.querySelector('[data-testid="session-list"]')?.querySelectorAll('div')[0]?.querySelectorAll('div');
  if (!divList) {
    setTimeout(updateSessionSelectorPage, 50);
    return;
  }
  var textContentDivs = Array.from(divList).filter(div => div.className.startsWith('awsui_text-content_'));

  textContentDivs.forEach(session => {
    var linkElement = session.querySelector('a');
    if (linkElement) {
      var originalText = linkElement.textContent.trim();
      if (!/^[\d-]+$/.test(originalText)) return; // Only dashes and numbers

      var accountId = originalText.replace(/-/g, ''); // Remove dashes
      var spanElement = document.createElement('span');
      spanElement.textContent = ` (${originalText})`;

      linkElement.textContent = `${accounts[accountId]}`; // Modify the displayed text
      linkElement.after(spanElement);
    }
  });
}

// Run appropriate function based on the page
if (window.location.pathname.includes("/saml")) {
  updateSAMLPage();
} else if (window.location.pathname.includes("/sessions/selector")) {
  updateSessionSelectorPage();
}
