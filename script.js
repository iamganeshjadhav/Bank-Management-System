// Base Account class
class Account {
  constructor(accountNumber, owner, balance = 0) {
    this.accountNumber = accountNumber;
    this.owner = owner;
    this.balance = balance;
    this.transactions = [];
  }

  deposit(amount) {
    if (amount > 0) {
      this.balance += amount;
      this.addTransaction("Deposit", amount);
    }
  }

  withdraw(amount) {
    if (amount > 0 && amount <= this.balance) {
      this.balance -= amount;
      this.addTransaction("Withdraw", amount);
      return true;
    } else {
      alert("Insufficient balance!");
      return false;
    }
  }

  addTransaction(type, amount) {
    this.transactions.push({
      id: Date.now(),
      type,
      amount,
      date: new Date().toLocaleString()
    });
  }
}

// Savings Account
class SavingsAccount extends Account {
  constructor(accountNumber, owner, balance, interestRate = 5) {
    super(accountNumber, owner, balance);
    this.interestRate = interestRate;
  }

  applyInterest() {
    const interest = this.balance * (this.interestRate / 100);
    this.deposit(interest);
    alert(`Interest of ₹${interest.toFixed(2)} applied.`);
  }
}

// Current Account
class CurrentAccount extends Account {
  constructor(accountNumber, owner, balance, overdraftLimit = 200) {
    super(accountNumber, owner, balance);
    this.overdraftLimit = overdraftLimit;
  }

  withdraw(amount) {
    if (amount > 0 && amount <= this.balance + this.overdraftLimit) {
      this.balance -= amount;
      this.addTransaction("Withdraw", amount);
      return true;
    } else {
      alert("Overdraft limit exceeded!");
      return false;
    }
  }
}

// Bank Class
class Bank {
  constructor(name) {
    this.name = name;
    this.accounts = [];
    this.accCounter = 100;
  }

  createAccount(type, owner, balance) {
    this.accCounter++;
    let account;
    if (type === "savings") {
      account = new SavingsAccount(this.accCounter, owner, balance);
    } else {
      account = new CurrentAccount(this.accCounter, owner, balance);
    }
    this.accounts.push(account);
    return account;
  }

  findAccount(accNumber) {
    return this.accounts.find(acc => acc.accountNumber == accNumber);
  }

  transferFunds(fromAccNum, toAccNum, amount) {
    const fromAcc = this.findAccount(fromAccNum);
    const toAcc = this.findAccount(toAccNum);

    if (fromAcc && toAcc) {
      const success = fromAcc.withdraw(amount);
      if (success) {
        toAcc.deposit(amount);
        alert(`Transferred ₹${amount} from ${fromAccNum} to ${toAccNum}`);
      }
    } else {
      alert("Account not found!");
    }
  }
}

// UI Functions
const bank = new Bank("OOP Bank");

function createAccount() {
  const owner = document.getElementById("owner").value;
  const balance = parseFloat(document.getElementById("balance").value);
  const type = document.getElementById("accountType").value;

  if (owner && !isNaN(balance) && type) {
    const acc = bank.createAccount(type, owner, balance);
    alert(`${type} account created for ${owner} with Acc No: ${acc.accountNumber}`);
    displayAccounts();
    document.getElementById("owner").value = "";
    document.getElementById("balance").value = "";
    document.getElementById("accountType").value = "";
  } else {
    alert("Please enter valid details.");
  }
}

function deposit() {
  const accNum = document.getElementById("accNum").value;
  const amount = parseFloat(document.getElementById("amount").value);
  const acc = bank.findAccount(accNum);

  if (acc && amount > 0) {
    acc.deposit(amount);
    alert(`Deposited ₹${amount} to Account ${accNum}`);
    displayAccounts();
  } else {
    alert("Invalid details!");
  }
}

function withdraw() {
  const accNum = document.getElementById("accNum").value;
  const amount = parseFloat(document.getElementById("amount").value);
  const acc = bank.findAccount(accNum);

  if (acc && amount > 0) {
    const success = acc.withdraw(amount);
    if (success) displayAccounts();
  } else {
    alert("Invalid details!");
  }
}

function transferFunds() {
  const fromAcc = document.getElementById("fromAcc").value;
  const toAcc = document.getElementById("toAcc").value;
  const amount = parseFloat(document.getElementById("transferAmt").value);

  if (!isNaN(amount)) {
    bank.transferFunds(fromAcc, toAcc, amount);
    displayAccounts();
  } else {
    alert("Invalid amount!");
  }
}

function checkBalance() {
  const accNum = document.getElementById("checkAcc").value;
  const acc = bank.findAccount(accNum);
  const msg = document.getElementById("balanceMsg");
  if (acc) {
    msg.textContent = `💵 Balance: ₹${acc.balance}`;
  } else {
    alert("Account not found!");
  }
}

function showTransactions() {
  const accNum = document.getElementById("checkAcc").value;
  const acc = bank.findAccount(accNum);
  const txnList = document.getElementById("transactionList");
  txnList.innerHTML = "";

  if (acc) {
    if (acc.transactions.length === 0) {
      txnList.innerHTML = "<p>No transactions found.</p>";
    } else {
      acc.transactions.forEach(txn => {
        const div = document.createElement("div");
        div.classList.add("transaction-card");
        div.innerHTML = `<p><strong>${txn.type}</strong> ₹${txn.amount} on ${txn.date}</p>`;
        txnList.appendChild(div);
      });
    }
  } else {
    alert("Account not found!");
  }
}

function displayAccounts() {
  const list = document.getElementById("accountsList");
  list.innerHTML = "";
  bank.accounts.forEach(acc => {
    const div = document.createElement("div");
    div.classList.add("account-card");
    div.innerHTML = `
      <p><strong>Acc No:</strong> ${acc.accountNumber}</p>
      <p><strong>Owner:</strong> ${acc.owner}</p>
      <p><strong>Balance:</strong> ₹${acc.balance}</p>
      <p><strong>Type:</strong> ${acc instanceof SavingsAccount ? "Savings" : "Current"}</p>
    `;
    list.appendChild(div);
  });
}
