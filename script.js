let productCount = 0;
let editingRow = null;

function addProduct() {
    const productName = document.getElementById('productName').value;
    const productQuantity = parseFloat(document.getElementById('productQuantity').value);
    const productAmount = parseFloat(document.getElementById('productAmount').value);
    const productDiscount = parseFloat(document.getElementById('productDiscount').value);

    if (productName && !isNaN(productQuantity) && !isNaN(productAmount) && !isNaN(productDiscount)) {
        const netAmount = productQuantity * productAmount * (1 - (productDiscount / 100));

        if (editingRow) {
            updateRow(editingRow, productName, productQuantity, productAmount, productDiscount, netAmount);
            editingRow = null;
        } else {
            productCount++;
            const tableBody = document.getElementById('productTableBody');
            const newRow = document.createElement('tr');

            newRow.innerHTML = `
                <td>${productCount}</td>
                <td>${productName}</td>
                <td>${productQuantity}</td>
                <td>${productAmount.toFixed(2)}</td>
                <td>${productDiscount.toFixed(2)}</td>
                <td>${netAmount.toFixed(2)}</td>
                <td>
                    <button onclick="editProduct(this)">Edit</button>
                    <button onclick="removeProduct(this)">Remove</button>
                </td>
            `;

            tableBody.appendChild(newRow);
        }

        updateTotalAmount();
        clearInputs();
    } else {
        alert('Please fill in all fields with valid numbers.');
    }
}

function clearInputs() {
    document.getElementById('productName').value = '';
    document.getElementById('productQuantity').value = '';
    document.getElementById('productAmount').value = '';
    document.getElementById('productDiscount').value = '';
}

function editProduct(button) {
    const row = button.parentNode.parentNode;
    const cells = row.getElementsByTagName('td');

    document.getElementById('productName').value = cells[1].innerText;
    document.getElementById('productQuantity').value = cells[2].innerText;
    document.getElementById('productAmount').value = cells[3].innerText;
    document.getElementById('productDiscount').value = cells[4].innerText;

    editingRow = row;
}

function updateRow(row, productName, productQuantity, productAmount, productDiscount, netAmount) {
    const cells = row.getElementsByTagName('td');
    cells[1].innerText = productName;
    cells[2].innerText = productQuantity;
    cells[3].innerText = productAmount.toFixed(2);
    cells[4].innerText = productDiscount.toFixed(2);
    cells[5].innerText = netAmount.toFixed(2);

    updateTotalAmount();
}

function removeProduct(button) {
    const row = button.parentNode.parentNode;
    row.parentNode.removeChild(row);

    updateTotalAmount();
}

function updateTotalAmount() {
    const tableBody = document.getElementById('productTableBody');
    const rows = tableBody.getElementsByTagName('tr');
    let totalAmount = 0;

    for (let row of rows) {
        const cells = row.getElementsByTagName('td');
        const netAmount = parseFloat(cells[5].innerText);
        totalAmount += netAmount;
    }

    document.getElementById('totalAmount').innerText = totalAmount.toFixed(2);
}

function printProductTable() {
    const tableBody = document.getElementById('productTableBody').cloneNode(true);
    const rows = tableBody.getElementsByTagName('tr');
    
    for (let row of rows) {
        const cells = row.getElementsByTagName('td');
        while (cells.length > 6) {
            row.removeChild(cells[cells.length - 1]);
        }
    }

    const totalAmountRow = document.createElement('tr');
    totalAmountRow.innerHTML = `
        <td colspan="5">Total Amount</td>
        <td>${document.getElementById('totalAmount').innerText}</td>
    `;

    tableBody.appendChild(totalAmountRow);

    const currentDate = new Date().toLocaleDateString();
    const printContent = `
        <div>
            <h1>Fida Pharma</h1>
            <p>Date: ${currentDate}</p>
        </div>
        <table border="1" style="width: 100%; border-collapse: collapse;">
            <thead>
                <tr>
                    <th>No.</th>
                    <th>Product's Name</th>
                    <th>Quantity</th>
                    <th>Amount per Unit</th>
                    <th>Discount Percent</th>
                    <th>Net Amount</th>
                </tr>
            </thead>
            <tbody>
                ${tableBody.innerHTML}
            </tbody>
        </table>
    `;

    const newWindow = window.open('', '', 'width=800, height=600');
    newWindow.document.write('<html><head><title>Print Table</title>');
    newWindow.document.write('<style>table {width: 100%; border-collapse: collapse;} th, td {border: 1px solid black; padding: 8px; text-align: left;} h1, p {text-align: center;}</style>');
    newWindow.document.write('</head><body>');
    newWindow.document.write(printContent);
    newWindow.document.write('</body></html>');
    newWindow.document.close();
    newWindow.print();
}
