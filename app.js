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
  } else if (type === 'departure') {
    document.getElementById('departureScreen').classList.remove('hidden');
  } else if (type === 'turnaround') {
    document.getElementById('turnaroundScreen').classList.remove('hidden');
  }
} 

function goHome() {
  document.getElementById('arrivalScreen').classList.add('hidden');
  document.getElementById('homeScreen').classList.remove('hidden');
}

function openHistory() {
  document.getElementById('homeScreen').classList.add('hidden');
  document.getElementById('historyScreen').classList.remove('hidden');
  loadHistory();
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

// ── DEPARTURE FORM ────────────────────────────────────

function openDepartureForm() {
  document.getElementById('homeScreen').classList.add('hidden');
  document.getElementById('departureScreen').classList.remove('hidden');
}

function goHomeDeparture() {
  document.getElementById('departureScreen').classList.add('hidden');
  document.getElementById('homeScreen').classList.remove('hidden');
}

// ── BAG TAGS ──────────────────────────────────────────
function addBagTagRow() {
  const wrap = document.getElementById('bagTagsWrap');
  const row = document.createElement('div');
  row.className = 'bag-tag-row';
  row.innerHTML = `
    <div class="bag-tag-inputs">
      <div class="field"><label>No. Tags</label><input type="number" class="tag-count" placeholder="0"></div>
      <div class="field"><label>Container</label><input type="text" class="tag-container" placeholder="Container"></div>
    </div>
  `;
  wrap.appendChild(row);
}

function collectBagTags() {
  const tags = [];
  document.querySelectorAll('.bag-tag-row').forEach(row => {
    const count = row.querySelector('.tag-count')?.value || '';
    const container = row.querySelector('.tag-container')?.value || '';
    if (count || container) {
      tags.push({ count, container });
    }
  });
  return tags;
}

// ── COLLECT DEPARTURE FORM DATA ───────────────────────
function collectDepartureFormData() {
  return {
    // Departure
    flight_number: document.getElementById('dep_flightNumber').value,
    flight_date: document.getElementById('dep_flightDate').value || null,
    coordinator_name: document.getElementById('dep_coordinatorName').value,
    trc_at_parking_bay: document.getElementById('dep_trcAtParkingBay').value || null,
    parking_bay: document.getElementById('dep_parkingBay').value,
    bay_clear_fod: document.getElementById('dep_bayClearFod').value,
    safety_cones_in_place: document.getElementById('dep_safetyConesInPlace').value,
    number_of_safety_cones: parseInt(document.getElementById('dep_numberOfCones').value) || 0,

    // Flight details
    aircraft_type: document.getElementById('dep_aircraftType').value,
    registration: document.getElementById('dep_registration').value,
    std: document.getElementById('dep_std').value || null,
    flight_deck_arrive_onboard: document.getElementById('dep_flightDeckArrive').value || null,
    captains_name: document.getElementById('dep_captainsName').value,
    cabin_crew_arrive_onboard: document.getElementById('dep_cabinCrewArrive').value || null,
    pursers_name: document.getElementById('dep_pursersName').value,
    expected_pax_jc: parseInt(document.getElementById('dep_expectedPaxJC').value) || 0,
    expected_pax_yc: parseInt(document.getElementById('dep_expectedPaxYC').value) || 0,

    // Fuelling
    fuel_bowser_on_bay: document.getElementById('dep_fuelBowserOnBay').value || null,
    fuelling_completed: document.getElementById('dep_fuellingCompleted').value || null,
    rtow: document.getElementById('dep_rtow').value,
    block_fuel: document.getElementById('dep_blockFuel').value,
    trip_fuel: document.getElementById('dep_tripFuel').value,
    taxi_fuel: document.getElementById('dep_taxiFuel').value,
    fuel_cap_closed: document.getElementById('dep_fuelCapClosed').value,

    // Baggage
    baggage_supervisor: document.getElementById('dep_baggageSupervisor').value,
    radio_number: document.getElementById('dep_radioNumber').value,
    staff_on_bay: document.getElementById('dep_staffOnBay').value || null,
    equipment_on_bay: document.getElementById('dep_equipmentOnBay').value || null,
    step_chute_parked: document.getElementById('dep_stepChuteParked').value || null,
    gpu: document.getElementById('dep_gpu').value || null,
    cargo_on_bay: document.getElementById('dep_cargoOnBay').value || null,
    final_baggage_on_bay: document.getElementById('dep_finalBaggageOnBay').value || null,
    brs_manifest: document.getElementById('dep_brsManifest').value,
    baggage_expected: parseInt(document.getElementById('dep_baggageExpected').value) || 0,
    final_baggage_received: parseInt(document.getElementById('dep_finalBaggageReceived').value) || 0,
    hand_baggage_removed: document.getElementById('dep_handBaggageRemoved').value,
    number_of_bags_offloaded: parseInt(document.getElementById('dep_bagsOffloaded').value) || 0,
    total_baggage_loaded: parseInt(document.getElementById('dep_totalBaggageLoaded').value) || 0,

    // Grooming
    ac_clean_type: document.getElementById('dep_acCleanType').value,
    grooming_on_ac: document.getElementById('dep_groomingOn').value || null,
    grooming_off_ac: document.getElementById('dep_groomingOff').value || null,
    customs_bin_loaded: document.getElementById('dep_customsBinLoaded').value,
    number_spray_cleans: parseInt(document.getElementById('dep_sprayCleans').value) || 0,
    immigration_forms: document.getElementById('dep_immigrationForms').value,
    duvets_loaded_jc: parseInt(document.getElementById('dep_duvetsJC').value) || 0,
    duvets_loaded_crew_rest: parseInt(document.getElementById('dep_duvetsCrewRest').value) || 0,
    headsets_loaded: document.getElementById('dep_headsetsLoaded').value,
    return_headsets: parseInt(document.getElementById('dep_returnHeadsets').value) || 0,
    return_cabin_dressing_bags: parseInt(document.getElementById('dep_returnCabinDressingBags').value) || 0,
    potable_water: document.getElementById('dep_potableWater').value,
    waste_services_done: document.getElementById('dep_wasteServicesDone').value,
    amenity_bags_jc: parseInt(document.getElementById('dep_amenityBagsJC').value) || 0,
    amenity_bags_yc: parseInt(document.getElementById('dep_amenityBagsYC').value) || 0,
    return_amenity_bags_jc: parseInt(document.getElementById('dep_returnAmenityJC').value) || 0,
    return_amenity_bags_yc: parseInt(document.getElementById('dep_returnAmenityYC').value) || 0,

    // Boarding
    ok_to_board: document.getElementById('dep_okToBoard').value || null,
    hand_luggage_staff: document.getElementById('dep_handLuggageStaff').value,
    first_passenger_boarded: document.getElementById('dep_firstPassengerBoarded').value || null,
    last_passenger_boarded: document.getElementById('dep_lastPassengerBoarded').value || null,
    final_slip_received: document.getElementById('dep_finalSlipReceived').value || null,
    pau_on_bay: document.getElementById('dep_pauOnBay').value || null,
    pau_leave_bay: document.getElementById('dep_pauLeaveBay').value || null,
    final_pax_totals_jc: parseInt(document.getElementById('dep_finalPaxJC').value) || 0,
    final_pax_totals_yc: parseInt(document.getElementById('dep_finalPaxYC').value) || 0,
    total_infants: parseInt(document.getElementById('dep_totalInfants').value) || 0,
    final_pax_totals: parseInt(document.getElementById('dep_finalPaxTotals').value) || 0,

    // Airchefs
    start_loading: document.getElementById('dep_startLoading').value || null,
    complete_loading: document.getElementById('dep_completeLoading').value || null,
    ac_config_jc: parseInt(document.getElementById('dep_acConfigJC').value) || 0,
    ac_config_yc: parseInt(document.getElementById('dep_acConfigYC').value) || 0,
    pax_booked_jc: parseInt(document.getElementById('dep_paxBookedJC').value) || 0,
    pax_booked_yc: parseInt(document.getElementById('dep_paxBookedYC').value) || 0,
    meals_loaded_jc: parseInt(document.getElementById('dep_mealsJC').value) || 0,
    special_meals_jc: parseInt(document.getElementById('dep_specialMealsJC').value) || 0,
    total_meals_jc: parseInt(document.getElementById('dep_totalMealsJC').value) || 0,
    meals_loaded_yc: parseInt(document.getElementById('dep_mealsYC').value) || 0,
    special_meals_yc: parseInt(document.getElementById('dep_specialMealsYC').value) || 0,
    total_meals_yc: parseInt(document.getElementById('dep_totalMealsYC').value) || 0,
    return_meals_jc: parseInt(document.getElementById('dep_returnMealsJC').value) || 0,
    return_meals_yc: parseInt(document.getElementById('dep_returnMealsYC').value) || 0,
    airchefs_signoff: document.getElementById('dep_airchefsSignoff').value || null,

    // Security
    security_check_started: document.getElementById('dep_securityStarted').value || null,
    security_check_stopped: document.getElementById('dep_securityStopped').value || null,
    security_check_found: document.getElementById('dep_securityFound').value,
    bag_tags: collectBagTags(),

    // Departure checks
    tug_on_bay: document.getElementById('dep_tugOnBay').value || null,
    holds_closed: document.getElementById('dep_holdsClosed').value || null,
    doors_closed: document.getElementById('dep_doorsClosed').value || null,
    stairs_removed: document.getElementById('dep_stairsRemoved').value || null,
    atd: document.getElementById('dep_atd').value || null,
    check_gse_moved: document.getElementById('dep_check1').checked,
    check_gse_parked: document.getElementById('dep_check2').checked,
    check_towbar_connected: document.getElementById('dep_check3').checked,
    check_covers_removed: document.getElementById('dep_check4').checked,
    check_intakes_clear: document.getElementById('dep_check5').checked,
    check_panels_closed: document.getElementById('dep_check6').checked,
    check_ac_damage: document.getElementById('dep_check7').checked,
    departure_signature: document.getElementById('dep_signature').value,

    // Additional
    comments_general: document.getElementById('dep_commentsGeneral').value,
    comments_passengers: document.getElementById('dep_commentsPassengers').value,
    comments_airchefs: document.getElementById('dep_commentsAirchefs').value,
    comments_grooming: document.getElementById('dep_commentsGrooming').value,
    comments_baggage: document.getElementById('dep_commentsBaggage').value,
    delay_comments: document.getElementById('dep_delayComments').value,

    form_status: 'Submitted'
  };
}

// ── SAVE DEPARTURE DRAFT ──────────────────────────────
function saveDepartureDraft() {
  const data = collectDepartureFormData();
  data.form_status = 'Draft';
  localStorage.setItem('saa_qa_dep_draft', JSON.stringify(data));
  showToast('✓ Draft saved');
}

// ── SUBMIT DEPARTURE FORM ─────────────────────────────
async function submitDepartureForm() {
  const data = collectDepartureFormData();

  if (!data.flight_number) {
    showToast('Please enter a flight number');
    return;
  }

  const submitBtn = document.querySelector('#departureScreen .submit-btn');
  submitBtn.textContent = 'Submitting...';
  submitBtn.disabled = true;

  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/ramp_qa_departures`, {
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
      localStorage.removeItem('saa_qa_dep_draft');
      showToast('✓ Form submitted successfully');
     setTimeout(() => goHomeDeparture(), 1500);
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

// Set today's date for departure form
document.getElementById('dep_flightDate').value = new Date().toISOString().split('T')[0]; 

// ── TURNAROUND FORM ───────────────────────────────────

function goHomeTurnaround() {
  document.getElementById('turnaroundScreen').classList.add('hidden');
  document.getElementById('homeScreen').classList.remove('hidden');
}

// ── TURNAROUND BUSES ──────────────────────────────────
function addTaBusRow() {
  const wrap = document.getElementById('taBusWrap');
  const row = document.createElement('div');
  row.className = 'bag-tag-row';
  row.innerHTML = `
    <div class="bag-tag-inputs">
      <div class="field"><label>Bus Number</label><input type="text" class="ta-bus-number" placeholder="Bus #"></div>
      <div class="field"><label>Bus Time</label><input type="time" class="ta-bus-time"></div>
    </div>
  `;
  wrap.appendChild(row);
}

function collectTaBuses() {
  const buses = [];
  document.querySelectorAll('#taBusWrap .bag-tag-row').forEach(row => {
    const number = row.querySelector('.ta-bus-number')?.value || '';
    const time = row.querySelector('.ta-bus-time')?.value || '';
    if (number || time) {
      buses.push({ number, time });
    }
  });
  return buses;
}

// ── COLLECT TURNAROUND FORM DATA ──────────────────────
function collectTurnaroundFormData() {
  return {
    // Header
    arrival_flight_number: document.getElementById('ta_flightNumber').value,
    flight_date: document.getElementById('ta_flightDate').value || null,
    coordinator_name: document.getElementById('ta_coordinatorName').value,
    trc_at_parking_bay: document.getElementById('ta_trcAtParkingBay').value || null,
    parking_bay: document.getElementById('ta_parkingBay').value,
    bay_clear_fod: document.getElementById('ta_bayClearFod').value,
    safety_cones_in_place: document.getElementById('ta_safetyConesInPlace').value,
    number_of_safety_cones: parseInt(document.getElementById('ta_numberOfCones').value) || 0,

    // Arrival flight details
    aircraft_type: document.getElementById('ta_aircraftType').value,
    registration: document.getElementById('ta_registration').value,
    sta: document.getElementById('ta_sta').value || null,
    eta: document.getElementById('ta_eta').value || null,
    ata: document.getElementById('ta_ata').value || null,
    chocked_time: document.getElementById('ta_chockedTime').value || null,
    thumbs_up: document.getElementById('ta_thumbsUp').value || null,

    // Arrival checklist
    check_bay_clear: document.getElementById('ta_check1').checked,
    check_chocks_available: document.getElementById('ta_check2').checked,
    check_ground_power: document.getElementById('ta_check3').checked,
    check_aircraft_chocked: document.getElementById('ta_check4').checked,
    check_trc_approach: document.getElementById('ta_check5').checked,
    check_fdc_brakes: document.getElementById('ta_check6').checked,
    check_ac_damage: document.getElementById('ta_check7').checked,
    arrival_signature: document.getElementById('ta_arrivalSignature').value,

    // Arrival baggage
    baggage_supervisor: document.getElementById('ta_baggageSupervisor').value,
    radio_number: document.getElementById('ta_radioNumber').value,
    staff_on_bay: document.getElementById('ta_staffOnBay').value || null,
    equipment_on_bay: document.getElementById('ta_equipmentOnBay').value || null,
    step_chute_parked: document.getElementById('ta_stepChuteParked').value || null,
    gpu: document.getElementById('ta_gpu').value || null,
    cargo_holds_open: document.getElementById('ta_cargoHoldsOpen').value || null,
    first_bag_off: document.getElementById('ta_firstBagOff').value || null,
    first_bag_sent: document.getElementById('ta_firstBagSent').value || null,
    last_bag_off: document.getElementById('ta_lastBagOff').value || null,
    last_bag_sent: document.getElementById('ta_lastBagSent').value || null,
    first_cargo_off: document.getElementById('ta_firstCargoOff').value || null,
    last_cargo_off: document.getElementById('ta_lastCargoOff').value || null,
    cargo_hold_inspection: document.getElementById('ta_cargoHoldInspection').value,
    flight_sup_signature: document.getElementById('ta_flightSupSignature').value,

    // Buses
    bus_number: JSON.stringify(collectTaBuses()),
    bus_time: null,

    // Passengers
    arrival_staff_on_bay: document.getElementById('ta_arrivalStaffOnBay').value || null,
    first_passenger_off: document.getElementById('ta_firstPassengerOff').value || null,
    last_passenger_off: document.getElementById('ta_lastPassengerOff').value || null,
    pau_arrive: document.getElementById('ta_pauArrive').value || null,
    pau_depart: document.getElementById('ta_pauDepart').value || null,

    // Additional
    comments_general: document.getElementById('ta_commentsGeneral').value,
    comments_passengers: document.getElementById('ta_commentsPassengers').value,
    comments_airchefs: document.getElementById('ta_commentsAirchefs').value,
    comments_grooming: document.getElementById('ta_commentsGrooming').value,
    comments_baggage: document.getElementById('ta_commentsBaggage').value,

    form_status: 'Submitted'
  };
}

// ── SAVE TURNAROUND DRAFT ─────────────────────────────
function saveTurnaroundDraft() {
  const data = collectTurnaroundFormData();
  data.form_status = 'Draft';
  localStorage.setItem('saa_qa_ta_draft', JSON.stringify(data));
  showToast('✓ Draft saved');
}

// ── SUBMIT TURNAROUND FORM ────────────────────────────
async function submitTurnaroundForm() {
  const data = collectTurnaroundFormData();

  if (!data.arrival_flight_number) {
    showToast('Please enter a flight number');
    return;
  }

  const submitBtn = document.querySelector('#turnaroundScreen .submit-btn');
  submitBtn.textContent = 'Submitting...';
  submitBtn.disabled = true;

  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/ramp_qa_turnaround`, {
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
      localStorage.removeItem('saa_qa_ta_draft');
      showToast('✓ Form submitted successfully');
      setTimeout(() => goHomeTurnaround(), 1500);
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

// Set today's date for turnaround form
document.getElementById('ta_flightDate').value = new Date().toISOString().split('T')[0];
// ── HISTORY SCREEN ────────────────────────────────────

let allSubmissions = [];
let currentFilter = 'all';

function goHomeHistory() {
  document.getElementById('historyScreen').classList.add('hidden');
  document.getElementById('homeScreen').classList.remove('hidden');
}

function filterHistory(type) {
  currentFilter = type;

  // Update active tab
  document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
  document.getElementById('tab-' + type).classList.add('active');

  // Filter and render
  const filtered = type === 'all' ? allSubmissions :
    allSubmissions.filter(s => s.type === type);

  renderHistory(filtered);
}

function renderHistory(submissions) {
  const list = document.getElementById('historyList');
  const empty = document.getElementById('historyEmpty');

  if (submissions.length === 0) {
    list.classList.add('hidden');
    empty.classList.remove('hidden');
    return;
  }

  empty.classList.add('hidden');
  list.classList.remove('hidden');

  list.innerHTML = submissions.map(s => {
    const typeLabel = s.type === 'arrivals' ? 'Arrival' :
                      s.type === 'departures' ? 'Departure' : 'Turnaround';
    const typeClass = s.type === 'arrivals' ? 'type-arrival' :
                      s.type === 'departures' ? 'type-departure' : 'type-turnaround';
    const date = new Date(s.created_at).toLocaleDateString('en-ZA', {
      day: '2-digit', month: 'short', year: 'numeric'
    });
    const time = new Date(s.created_at).toLocaleTimeString('en-ZA', {
      hour: '2-digit', minute: '2-digit'
    });

    return `
      <div class="history-card">
        <div class="history-card-top">
          <span class="history-flight">${s.flight_number || s.arrival_flight_number || '—'}</span>
          <span class="history-type ${typeClass}">${typeLabel}</span>
        </div>
        <div class="history-card-meta">
          <div class="history-meta-item">
            Bay
            <span>${s.parking_bay || '—'}</span>
          </div>
          <div class="history-meta-item">
            Coordinator
            <span>${s.coordinator_name || '—'}</span>
          </div>
          <div class="history-meta-item">
            Aircraft
            <span>${s.aircraft_type || '—'} ${s.registration || ''}</span>
          </div>
          <div class="history-meta-item">
            Date
            <span>${s.flight_date || '—'}</span>
          </div>
        </div>
        <div class="history-card-bottom">
          <span class="history-submitted">Submitted ${date} at ${time}</span>
          <span class="history-status">${s.form_status || 'Submitted'}</span>
        </div>
      </div>`;
  }).join('');
}

async function loadHistory() {
  const loading = document.getElementById('historyLoading');
  const list = document.getElementById('historyList');
  const empty = document.getElementById('historyEmpty');

  loading.classList.remove('hidden');
  list.classList.add('hidden');
  empty.classList.add('hidden');
  allSubmissions = [];

  try {
    // Fetch all 3 tables
    const [arrivalsRes, departuresRes, turnaroundRes] = await Promise.all([
      fetch(`${SUPABASE_URL}/rest/v1/ramp_qa_arrivals?select=*&order=created_at.desc&limit=50`, {
        headers: { 'apikey': SUPABASE_KEY, 'Authorization': `Bearer ${SUPABASE_KEY}` }
      }),
      fetch(`${SUPABASE_URL}/rest/v1/ramp_qa_departures?select=*&order=created_at.desc&limit=50`, {
        headers: { 'apikey': SUPABASE_KEY, 'Authorization': `Bearer ${SUPABASE_KEY}` }
      }),
      fetch(`${SUPABASE_URL}/rest/v1/ramp_qa_turnaround?select=*&order=created_at.desc&limit=50`, {
        headers: { 'apikey': SUPABASE_KEY, 'Authorization': `Bearer ${SUPABASE_KEY}` }
      })
    ]);

    const arrivals = await arrivalsRes.json();
    const departures = await departuresRes.json();
    const turnaround = await turnaroundRes.json();

    // Tag each with type
    const taggedArrivals = arrivals.map(r => ({ ...r, type: 'arrivals' }));
    const taggedDepartures = departures.map(r => ({ ...r, type: 'departures' }));
    const taggedTurnaround = turnaround.map(r => ({ ...r, type: 'turnaround' }));

    // Combine and sort by date
    allSubmissions = [...taggedArrivals, ...taggedDepartures, ...taggedTurnaround]
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    loading.classList.add('hidden');
    filterHistory(currentFilter);

  } catch (error) {
    console.error(error);
    loading.classList.add('hidden');
    empty.classList.remove('hidden');
    showToast('Failed to load submissions');
  }
}