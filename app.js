// ── SUPABASE CONFIG ───────────────────────────────────
const SUPABASE_URL = 'https://fokealhvpgnjubfhknix.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZva2VhbGh2cGduanViZmhrbml4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY5NDIxOTcsImV4cCI6MjEwMjUxODE5N30.vxpgMApNNsDPKKR3Vt1e_OYeuv5tjg8_yb9hhEe6CRk';

// ── TOAST ─────────────────────────────────────────────
function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2500);
}

// ── NAVIGATION ────────────────────────────────────────
function openForm(type) {
  document.getElementById('homeScreen').classList.add('hidden');
  if (type === 'arrival') {
    document.getElementById('arrivalScreen').classList.remove('hidden');
  }
}

function goHome() {
  document.getElementById('arrivalScreen').classList.add('hidden');
  document.getElementById('homeScreen').classList.remove('hidden');
}

function openHistory() {
  showToast('Submitted forms coming soon');
}

// ── SECTION TOGGLE ────────────────────────────────────
function toggleSection(name) {
  const body = document.getElementById('body-' + name);
  const chevron = document.getElementById('chevron-' + name);
  body.classList.toggle('hidden');
  chevron.classList.toggle('open');
}

// ── COLLECT FORM DATA ─────────────────────────────────
function collectFormData() {
  return {
    // Arrival
    flight_number: document.getElementById('flightNumber').value,
    flight_date: document.getElementById('flightDate').value || null,
    coordinator_name: document.getElementById('coordinatorName').value,
    trc_at_parking_bay: document.getElementById('trcAtParkingBay').value || null,
    parking_bay: document.getElementById('parkingBay').value,
    bay_clear_fod: document.getElementById('bayClearFod').value,
    safety_cones_in_place: document.getElementById('safetyConesInPlace').value,
    number_of_safety_cones: parseInt(document.getElementById('numberOfCones').value) || 0,

    // Inbound
    aircraft_type: document.getElementById('aircraftType').value,
    registration: document.getElementById('registration').value,
    sta: document.getElementById('sta').value || null,
    eta: document.getElementById('eta').value || null,
    ata: document.getElementById('ata').value || null,
    chocked_time: document.getElementById('chockedTime').value || null,
    thumbs_up: document.getElementById('thumbsUp').value || null,

    // Checklist
    check_bay_clear: document.getElementById('check1').checked,
    check_chocks_available: document.getElementById('check2').checked,
    check_ground_power: document.getElementById('check3').checked,
    check_aircraft_chocked: document.getElementById('check4').checked,
    check_trc_approach: document.getElementById('check5').checked,
    check_fdc_brakes: document.getElementById('check6').checked,
    check_ac_damage: document.getElementById('check7').checked,

    // Signatures
    inbound_signature: document.getElementById('inboundSignature').value,
    flight_sup_signature: document.getElementById('flightSupSignature').value,

    // Baggage
    baggage_supervisor: document.getElementById('baggageSupervisor').value,
    radio_number: document.getElementById('radioNumber').value,
    staff_on_bay: document.getElementById('staffOnBay').value || null,
    equipment_on_bay: document.getElementById('equipmentOnBay').value || null,
    step_chute_parked: document.getElementById('stepChuteParked').value || null,
    gpu: document.getElementById('gpu').value || null,
    cargo_holds_open: document.getElementById('cargoHoldsOpen').value || null,
    first_bag_off: document.getElementById('firstBagOff').value || null,
    first_bag_sent: document.getElementById('firstBagSent').value || null,
    last_bag_off: document.getElementById('lastBagOff').value || null,
    last_bag_sent: document.getElementById('lastBagSent').value || null,
    first_cargo_off: document.getElementById('firstCargoOff').value || null,
    last_cargo_off: document.getElementById('lastCargoOff').value || null,
    cargo_hold_inspection: document.getElementById('cargoHoldInspection').value,

    // Buses
    bus_number: document.getElementById('busNumber').value,
    bus_time: document.getElementById('busTime').value || null,

    // Passengers
    arrival_staff_on_bay: document.getElementById('arrivalStaffOnBay').value || null,
    first_passenger_off: document.getElementById('firstPassengerOff').value || null,
    last_passenger_off: document.getElementById('lastPassengerOff').value || null,
    pau_arrive: document.getElementById('pauArrive').value || null,
    pau_depart: document.getElementById('pauDepart').value || null,

    // Grooming
    aircraft_clean_type: document.getElementById('aircraftCleanType').value,
    grooming_on_aircraft: document.getElementById('groomingOn').value || null,
    grooming_off_aircraft: document.getElementById('groomingOff').value || null,
    potable_water: document.getElementById('potableWater').value,
    waste_services_done: document.getElementById('wasteServicesDone').value,

    // Airchefs
    start_offloading: document.getElementById('startOffloading').value || null,
    completed_offloading: document.getElementById('completedOffloading').value || null,
    bars_sealed: document.getElementById('barsSealed').value,

    // Additional
    comments_general: document.getElementById('commentsGeneral').value,
    comments_passengers: document.getElementById('commentsPassengers').value,
    comments_airchefs: document.getElementById('commentsAirchefs').value,
    comments_grooming: document.getElementById('commentsGrooming').value,
    comments_baggage: document.getElementById('commentsBaggage').value,

    // Metadata
    form_status: 'Submitted'
  };
}

// ── SAVE DRAFT ────────────────────────────────────────
function saveDraft() {
  const data = collectFormData();
  data.form_status = 'Draft';
  localStorage.setItem('saa_qa_draft', JSON.stringify(data));
  showToast('✓ Draft saved');
}

function loadDraft() {
  const saved = localStorage.getItem('saa_qa_draft');
  if (!saved) return;
  try {
    const d = JSON.parse(saved);
    Object.keys(d).forEach(key => {
      const el = document.getElementById(key) ||
                 document.getElementById(toCamel(key));
      if (!el) return;
      if (el.type === 'checkbox') el.checked = d[key];
      else el.value = d[key] || '';
    });
  } catch(e) {}
}

function toCamel(str) {
  return str.replace(/_([a-z])/g, (_, c) => c.toUpperCase());
}

// ── SUBMIT TO SUPABASE ────────────────────────────────
async function submitForm() {
  const data = collectFormData();

  if (!data.flight_number) {
    showToast('Please enter a flight number');
    return;
  }

  const submitBtn = document.querySelector('.submit-btn');
  submitBtn.textContent = 'Submitting...';
  submitBtn.disabled = true;

  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/ramp_qa_arrivals`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
        'Prefer': 'return=minimal'
      },
      body: JSON.stringify(data)
    });

    if (response.ok) {
      localStorage.removeItem('saa_qa_draft');
      showToast('✓ Form submitted successfully');
      setTimeout(() => goHome(), 1500);
    } else {
      const err = await response.json();
      console.error(err);
      showToast('Submission failed — check console');
    }
  } catch (error) {
    console.error(error);
    showToast('Network error — try again');
  } finally {
    submitBtn.textContent = 'Submit Form';
    submitBtn.disabled = false;
  }
}

// ── INIT ──────────────────────────────────────────────
document.getElementById('flightDate').value = new Date().toISOString().split('T')[0];