const networkOptions = {
    mtn: [
        { text: "SME", value: "SME" },
        { text: "SME2", value: "SME2" },
        { text: "CORPORATE GIFTING", value: "CORPORATE" },
        { text: "DATA COUPONS", value: "DATA COUPONS" },
        { text: "GIFTING", value: "GIFTING" },
        { text: "ALL", value: "ALL" },
    ],
    glo: [
        { text: "CORPORATE GIFTING", value: "CORPORATE" },
        { text: "GIFTING", value: "GIFTING" },
        { text: "ALL", value: "ALL" },
    ],
    airtel: [
        { text: "CORPORATE GIFTING", value: "CORPORATE" },
        { text: "GIFTING", value: "GIFTING" },
        { text: "ALL", value: "ALL" },
    ],
    ninemobile: [
        { text: "CORPORATE GIFTING", value: "CORPORATE" },
        { text: "SME", value: "SME" },
        { text: "ALL", value: "ALL" },
    ]
};


let plan_d;
let data_p;
fetch('https://culpa.com.ng/pricing.php', {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          }})
    .then(response => response.json())
    .then(data => {
        plan_d = [data];
      console.log(plan_d)
    })
    .catch(error => console.error('Error fetching data:', error));

document.getElementById('id_network').addEventListener('change', () => {
    updatePlanType();
    resetOptions();
});

document.getElementById('id_data_type').addEventListener('change', updatePlan);

function updatePlanType() {
    const networkType = document.getElementById("id_network").value;
    const planType = document.getElementById("id_data_type");
    const plan = document.getElementById("plan");
    planType.innerHTML = "";
    plan.innerHTML = "";
    document.getElementById("id_Amount").value = ""
    plan.options.add(new Option("-----", ""));

    if (networkOptions[networkType]) {
        planType.options.add(new Option("-----", ""));
        networkOptions[networkType].forEach((option) => {
            planType.options.add(new Option(option.text, option.value));
        });
    }
}

function updatePlan() {
  console.log("cloud")
    const networkType = document.getElementById("id_network").value;
    const planType = document.getElementById("id_data_type").value;
    const plan = document.getElementById("plan");
    plan.innerHTML = "";
    document.getElementById("id_Amount").value = ""

    if (plan_d) {
      console.log(plan_d)
        plan_d.forEach(networkPlan => {
            if (networkPlan[networkType] && networkPlan[networkType][planType]) {
                plan.options.add(new Option("-----", ""));
               console.log(networkPlan[networkType][planType])
               networkPlan[networkType][planType].forEach((option) => {
                    plan.options.add(new Option(`${option.plan_type} - ${option.plan} (${option.month_validate} months)`, option.id));
                });
            }
        });
    }
}

function plandetail() {
    const networkType = document.getElementById("id_network").value;
    const planType = document.getElementById("id_data_type").value;
    const plan = document.getElementById("plan").value;

    if (plan_d) {
        plan_d.forEach(networkPlan => {
            if (networkPlan[networkType] && networkPlan[networkType][planType]) {
                const filteredArray = networkPlan[networkType][planType].filter(obj => obj.id == plan);
                data_p = filteredArray[0]
                document.getElementById("id_Amount").value = filteredArray[0].updated_plan_amount;
            }
        });
    }
}

function resetOptions() {
    const networkType = document.getElementById("id_network").value;
    const planType = document.getElementById("id_data_type");
    const plan = document.getElementById("plan");

    if (networkType === "") {
        planType.innerHTML = "";
        planType.options.add(new Option("-----", ""));
        plan.innerHTML = "";
        plan.options.add(new Option("-----", ""));
                        document.getElementById("id_Amount").value = ""
    }
}


async function handleSubmit(event) {
    event.preventDefault();
  let admin = document.querySelector("#admin").value
 // let userId = document.querySelector("#userId").value
 let userId = sessionStorage.getItem('userid')
 const mobileNumber = document.querySelector("#number").value
const p_data = {
  ...data_p,admin,userId,mobileNumber };
console.log(p_data)
    try {
        const response = await fetch("https://culpa.com.ng/data_purchase.php", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(p_data),
        });

        if (response) {
            const result = await response.json();
            console.log(result)
                        showModal(result.message);
            if (result.issucess === "true") {
            showModal(result.apiResponse || "Data purchase successful!");
            }
        } else {
            const errorText = await response.text();
            console.error("Error:", response.statusText);
            showModal("Error: " + response.statusText + " - " + errorText);
        }
    } catch (error) {
        console.error("Error:", error);
        showModal("An error occurred: " + error.message);
    }
}

document.getElementById('signupForm').addEventListener('submit', handleSubmit);

function showModal(message) {
    const modal = document.getElementById("myModal");
    const modalMessage = document.getElementById("modalMessage");
    const span = document.getElementsByClassName("close")[0];

    modalMessage.textContent = message;
    modal.style.display = "block";

    span.onclick = function () {
        modal.style.display = "none";
    };

    window.onclick = function (event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    };
}
