-- ============================================================
-- Billings Import SQL
-- 120 records
-- ============================================================

-- Billing #1: Afsana
INSERT INTO billings (id, serial_number, customer_name, mobile_number, customer_gender, subtotal, discount, tax, grand_total, payment_method, notes, created_at, updated_at)
VALUES (
  '2b234274-d5df-48be-9e81-dae9411cf79b',
  1,
  'Afsana',
  '7710636353',
  NULL,
  150,
  0,
  0,
  150,
  'Cash',
  NULL,
  '2026-06-02T10:00:00Z',
  '2026-06-02T10:00:00Z'
);

INSERT INTO billing_services (id, billing_id, name, price, quantity, service_by, staff_assignments, created_at)
VALUES (
  'bda8a8c4-e54d-46c7-9660-423195af579b',
  '2b234274-d5df-48be-9e81-dae9411cf79b',
  'Hair wash',
  150,
  1,
  'Simren',
  NULL,
  '2026-06-02T10:00:00Z'
);

-- Billing #2: Manas
INSERT INTO billings (id, serial_number, customer_name, mobile_number, customer_gender, subtotal, discount, tax, grand_total, payment_method, notes, created_at, updated_at)
VALUES (
  'a620590f-a193-4ba7-b5ab-050f5c94ec73',
  2,
  'Manas',
  '9979904466',
  NULL,
  200,
  0,
  0,
  200,
  'Cash',
  NULL,
  '2026-06-02T10:00:00Z',
  '2026-06-02T10:00:00Z'
);

INSERT INTO billing_services (id, billing_id, name, price, quantity, service_by, staff_assignments, created_at)
VALUES (
  'dc524b34-c6bc-4d3b-9a83-ddb04cbe7528',
  'a620590f-a193-4ba7-b5ab-050f5c94ec73',
  'Hair cut',
  200,
  1,
  'Sahil',
  NULL,
  '2026-06-02T10:00:00Z'
);

-- Billing #3: Mandeep
INSERT INTO billings (id, serial_number, customer_name, mobile_number, customer_gender, subtotal, discount, tax, grand_total, payment_method, notes, created_at, updated_at)
VALUES (
  '125d67f5-81d4-4a2e-8033-187375abfd91',
  3,
  'Mandeep',
  '9879904466',
  NULL,
  200,
  0,
  0,
  200,
  'UPI',
  NULL,
  '2026-06-02T10:00:00Z',
  '2026-06-02T10:00:00Z'
);

INSERT INTO billing_services (id, billing_id, name, price, quantity, service_by, staff_assignments, created_at)
VALUES (
  '34a620a7-6f0b-458a-aaf4-01e11c6d2c3e',
  '125d67f5-81d4-4a2e-8033-187375abfd91',
  'Hair cut',
  200,
  1,
  'Sahil',
  NULL,
  '2026-06-02T10:00:00Z'
);

-- Billing #4: Nandani
INSERT INTO billings (id, serial_number, customer_name, mobile_number, customer_gender, subtotal, discount, tax, grand_total, payment_method, notes, created_at, updated_at)
VALUES (
  '98ce5900-82ec-44b0-b9fa-9727d243f7ea',
  4,
  'Nandani',
  '9265958696',
  NULL,
  150,
  0,
  0,
  150,
  'UPI',
  NULL,
  '2026-06-03T10:00:00Z',
  '2026-06-03T10:00:00Z'
);

INSERT INTO billing_services (id, billing_id, name, price, quantity, service_by, staff_assignments, created_at)
VALUES (
  '1c75747e-8b93-4465-8650-c8d45e04ff78',
  '98ce5900-82ec-44b0-b9fa-9727d243f7ea',
  'Combo-4',
  150,
  1,
  'Shivani',
  NULL,
  '2026-06-03T10:00:00Z'
);

-- Billing #5: Pooja
INSERT INTO billings (id, serial_number, customer_name, mobile_number, customer_gender, subtotal, discount, tax, grand_total, payment_method, notes, created_at, updated_at)
VALUES (
  'fc8d49dd-5b63-455b-99b5-7ad0a78452c2',
  5,
  'Pooja',
  '9725914884',
  NULL,
  200,
  0,
  0,
  200,
  'UPI',
  NULL,
  '2026-06-03T10:00:00Z',
  '2026-06-03T10:00:00Z'
);

INSERT INTO billing_services (id, billing_id, name, price, quantity, service_by, staff_assignments, created_at)
VALUES (
  'ae901ecd-242b-4613-a2a8-71df75823509',
  'fc8d49dd-5b63-455b-99b5-7ad0a78452c2',
  'Hair cut',
  200,
  1,
  'Sahil',
  NULL,
  '2026-06-03T10:00:00Z'
);

-- Billing #6: Dr mehta
INSERT INTO billings (id, serial_number, customer_name, mobile_number, customer_gender, subtotal, discount, tax, grand_total, payment_method, notes, created_at, updated_at)
VALUES (
  'e06e4706-fc29-483b-a57e-656c4731411a',
  6,
  'Dr mehta',
  '9426344040',
  NULL,
  1000,
  0,
  0,
  1000,
  'UPI',
  NULL,
  '2026-06-03T10:00:00Z',
  '2026-06-03T10:00:00Z'
);

INSERT INTO billing_services (id, billing_id, name, price, quantity, service_by, staff_assignments, created_at)
VALUES (
  'a3b2b00a-1863-4ba8-976b-3dfb7d204aac',
  'e06e4706-fc29-483b-a57e-656c4731411a',
  'Combo-2',
  1000,
  1,
  'Afu, Shivani',
  '[{"staffName":"Afu","amount":500},{"staffName":"Shivani","amount":500}]'::jsonb,
  '2026-06-03T10:00:00Z'
);

-- Billing #7: client
INSERT INTO billings (id, serial_number, customer_name, mobile_number, customer_gender, subtotal, discount, tax, grand_total, payment_method, notes, created_at, updated_at)
VALUES (
  'a85c57e1-9113-4550-b23a-27eeced5405e',
  7,
  'client',
  '0000000000',
  NULL,
  200,
  0,
  0,
  200,
  'Cash',
  NULL,
  '2026-06-03T10:00:00Z',
  '2026-06-03T10:00:00Z'
);

INSERT INTO billing_services (id, billing_id, name, price, quantity, service_by, staff_assignments, created_at)
VALUES (
  'ee5e99c2-0501-4e39-89c4-39b825779ea3',
  'a85c57e1-9113-4550-b23a-27eeced5405e',
  'Heard massag',
  200,
  1,
  'Sahil',
  NULL,
  '2026-06-03T10:00:00Z'
);

-- Billing #8: Raman
INSERT INTO billings (id, serial_number, customer_name, mobile_number, customer_gender, subtotal, discount, tax, grand_total, payment_method, notes, created_at, updated_at)
VALUES (
  '1f11cfd3-c2c2-4a8d-8f66-936ede6eedc3',
  8,
  'Raman',
  '6358839909',
  NULL,
  100,
  0,
  0,
  100,
  'Cash',
  NULL,
  '2026-06-03T10:00:00Z',
  '2026-06-03T10:00:00Z'
);

INSERT INTO billing_services (id, billing_id, name, price, quantity, service_by, staff_assignments, created_at)
VALUES (
  'd22643d3-21fb-4f6c-bdce-8bf2d86f63b1',
  '1f11cfd3-c2c2-4a8d-8f66-936ede6eedc3',
  'beard',
  100,
  1,
  'Sahil',
  NULL,
  '2026-06-03T10:00:00Z'
);

-- Billing #9: sanjay
INSERT INTO billings (id, serial_number, customer_name, mobile_number, customer_gender, subtotal, discount, tax, grand_total, payment_method, notes, created_at, updated_at)
VALUES (
  '07e74b4a-4fe9-4dee-917c-4e47f655d9d0',
  9,
  'sanjay',
  '9828559777',
  NULL,
  100,
  0,
  0,
  100,
  'UPI',
  NULL,
  '2026-06-03T10:00:00Z',
  '2026-06-03T10:00:00Z'
);

INSERT INTO billing_services (id, billing_id, name, price, quantity, service_by, staff_assignments, created_at)
VALUES (
  '96140592-a269-4422-8f3f-b10a7ef8f770',
  '07e74b4a-4fe9-4dee-917c-4e47f655d9d0',
  'beard',
  100,
  1,
  'Sahil',
  NULL,
  '2026-06-03T10:00:00Z'
);

-- Billing #10: januj
INSERT INTO billings (id, serial_number, customer_name, mobile_number, customer_gender, subtotal, discount, tax, grand_total, payment_method, notes, created_at, updated_at)
VALUES (
  '0ee87331-c2e6-4d1f-b221-47ab5be74759',
  10,
  'januj',
  '7698026845',
  NULL,
  300,
  0,
  0,
  300,
  'Cash',
  NULL,
  '2026-06-03T10:00:00Z',
  '2026-06-03T10:00:00Z'
);

INSERT INTO billing_services (id, billing_id, name, price, quantity, service_by, staff_assignments, created_at)
VALUES (
  'f1aca12a-a86a-4a54-b4d0-bfd17e93eb19',
  '0ee87331-c2e6-4d1f-b221-47ab5be74759',
  'haircut',
  300,
  1,
  'Sahil',
  NULL,
  '2026-06-03T10:00:00Z'
);

-- Billing #11: sardha
INSERT INTO billings (id, serial_number, customer_name, mobile_number, customer_gender, subtotal, discount, tax, grand_total, payment_method, notes, created_at, updated_at)
VALUES (
  '283c396e-0c31-449f-ba1a-1234084dda4c',
  11,
  'sardha',
  '9925127780',
  NULL,
  200,
  0,
  0,
  200,
  'Cash',
  NULL,
  '2026-06-04T10:00:00Z',
  '2026-06-04T10:00:00Z'
);

INSERT INTO billing_services (id, billing_id, name, price, quantity, service_by, staff_assignments, created_at)
VALUES (
  'dfb54e5b-db92-459f-9d02-48123c53b36c',
  '283c396e-0c31-449f-ba1a-1234084dda4c',
  'haircut',
  200,
  1,
  'Afsana',
  NULL,
  '2026-06-04T10:00:00Z'
);

-- Billing #12: noname
INSERT INTO billings (id, serial_number, customer_name, mobile_number, customer_gender, subtotal, discount, tax, grand_total, payment_method, notes, created_at, updated_at)
VALUES (
  '00491b28-a24d-42df-8579-99593ce354ad',
  12,
  'noname',
  '8160111481',
  NULL,
  200,
  0,
  0,
  200,
  'Cash',
  NULL,
  '2026-06-04T10:00:00Z',
  '2026-06-04T10:00:00Z'
);

INSERT INTO billing_services (id, billing_id, name, price, quantity, service_by, staff_assignments, created_at)
VALUES (
  'e3e20dbe-ef05-4024-ace0-ef8416e2308e',
  '00491b28-a24d-42df-8579-99593ce354ad',
  'haircut',
  200,
  1,
  'Sahil',
  NULL,
  '2026-06-04T10:00:00Z'
);

-- Billing #13: client
INSERT INTO billings (id, serial_number, customer_name, mobile_number, customer_gender, subtotal, discount, tax, grand_total, payment_method, notes, created_at, updated_at)
VALUES (
  '38579ac1-434f-4794-a5e6-350eb28956c2',
  13,
  'client',
  '9638404728',
  NULL,
  100,
  0,
  0,
  100,
  'UPI',
  NULL,
  '2026-06-04T10:00:00Z',
  '2026-06-04T10:00:00Z'
);

INSERT INTO billing_services (id, billing_id, name, price, quantity, service_by, staff_assignments, created_at)
VALUES (
  'f4e76c4f-a2b6-4502-b280-669929dec2e8',
  '38579ac1-434f-4794-a5e6-350eb28956c2',
  'beard',
  100,
  1,
  'Sahil',
  NULL,
  '2026-06-04T10:00:00Z'
);

-- Billing #14: Sachin
INSERT INTO billings (id, serial_number, customer_name, mobile_number, customer_gender, subtotal, discount, tax, grand_total, payment_method, notes, created_at, updated_at)
VALUES (
  'a44872fd-677c-4b7f-99fe-12aac9cbbf53',
  14,
  'Sachin',
  '7040131132',
  NULL,
  300,
  0,
  0,
  300,
  'UPI',
  NULL,
  '2026-06-04T10:00:00Z',
  '2026-06-04T10:00:00Z'
);

INSERT INTO billing_services (id, billing_id, name, price, quantity, service_by, staff_assignments, created_at)
VALUES (
  'a396dd60-e257-4c91-8fba-32ea49aa27f6',
  'a44872fd-677c-4b7f-99fe-12aac9cbbf53',
  'Haircut+beard',
  300,
  1,
  'Sahil',
  NULL,
  '2026-06-04T10:00:00Z'
);

-- Billing #15: Naina
INSERT INTO billings (id, serial_number, customer_name, mobile_number, customer_gender, subtotal, discount, tax, grand_total, payment_method, notes, created_at, updated_at)
VALUES (
  '607755e9-d03d-4e91-8acc-9c47564cc0cb',
  15,
  'Naina',
  '9898252583',
  NULL,
  150,
  0,
  0,
  150,
  'Cash',
  NULL,
  '2026-06-04T10:00:00Z',
  '2026-06-04T10:00:00Z'
);

INSERT INTO billing_services (id, billing_id, name, price, quantity, service_by, staff_assignments, created_at)
VALUES (
  '41195101-7dda-41e1-904e-cdd4d05a688a',
  '607755e9-d03d-4e91-8acc-9c47564cc0cb',
  'threading',
  150,
  1,
  'Simren',
  NULL,
  '2026-06-04T10:00:00Z'
);

-- Billing #16: kiran
INSERT INTO billings (id, serial_number, customer_name, mobile_number, customer_gender, subtotal, discount, tax, grand_total, payment_method, notes, created_at, updated_at)
VALUES (
  'ecb16755-b1ce-420e-b745-d2bd4d8a3a99',
  16,
  'kiran',
  '9510206088',
  NULL,
  400,
  0,
  0,
  400,
  'UPI',
  NULL,
  '2026-06-04T10:00:00Z',
  '2026-06-04T10:00:00Z'
);

INSERT INTO billing_services (id, billing_id, name, price, quantity, service_by, staff_assignments, created_at)
VALUES (
  'bbc59a66-e8e6-4868-afac-a46ed7d26da1',
  'ecb16755-b1ce-420e-b745-d2bd4d8a3a99',
  'Heard massag',
  400,
  1,
  'Sahil',
  NULL,
  '2026-06-04T10:00:00Z'
);

-- Billing #17: Hetal
INSERT INTO billings (id, serial_number, customer_name, mobile_number, customer_gender, subtotal, discount, tax, grand_total, payment_method, notes, created_at, updated_at)
VALUES (
  'f6e98588-f7ea-41a6-a1b0-1485bf9ba927',
  17,
  'Hetal',
  '9898488408',
  NULL,
  200,
  0,
  0,
  200,
  'Cash',
  NULL,
  '2026-06-04T10:00:00Z',
  '2026-06-04T10:00:00Z'
);

INSERT INTO billing_services (id, billing_id, name, price, quantity, service_by, staff_assignments, created_at)
VALUES (
  '54387b0a-76fd-428f-b3a4-1da0519ff128',
  'f6e98588-f7ea-41a6-a1b0-1485bf9ba927',
  'face wax',
  200,
  1,
  'Simren, Shiv',
  '[{"staffName":"Simren","amount":100},{"staffName":"Shiv","amount":100}]'::jsonb,
  '2026-06-04T10:00:00Z'
);

-- Billing #18: Bhomi
INSERT INTO billings (id, serial_number, customer_name, mobile_number, customer_gender, subtotal, discount, tax, grand_total, payment_method, notes, created_at, updated_at)
VALUES (
  '54bf8277-f3a7-433f-813c-5acc35fe7625',
  18,
  'Bhomi',
  '9484588388',
  NULL,
  800,
  0,
  0,
  800,
  'UPI',
  NULL,
  '2026-06-04T10:00:00Z',
  '2026-06-04T10:00:00Z'
);

INSERT INTO billing_services (id, billing_id, name, price, quantity, service_by, staff_assignments, created_at)
VALUES (
  '0d3dd5c7-3418-4e71-bff5-09b860d6415a',
  '54bf8277-f3a7-433f-813c-5acc35fe7625',
  'combo-3',
  800,
  1,
  'Simren',
  NULL,
  '2026-06-04T10:00:00Z'
);

-- Billing #19: Parth
INSERT INTO billings (id, serial_number, customer_name, mobile_number, customer_gender, subtotal, discount, tax, grand_total, payment_method, notes, created_at, updated_at)
VALUES (
  'dc8c744e-c96c-4726-b855-811fd40714a5',
  19,
  'Parth',
  '9879018181',
  NULL,
  200,
  0,
  0,
  200,
  'UPI',
  NULL,
  '2026-06-04T10:00:00Z',
  '2026-06-04T10:00:00Z'
);

INSERT INTO billing_services (id, billing_id, name, price, quantity, service_by, staff_assignments, created_at)
VALUES (
  '459ce8dc-1b5b-4983-8f8d-42923944e957',
  'dc8c744e-c96c-4726-b855-811fd40714a5',
  'haircut',
  200,
  1,
  'Sahil',
  NULL,
  '2026-06-04T10:00:00Z'
);

-- Billing #20: Salok
INSERT INTO billings (id, serial_number, customer_name, mobile_number, customer_gender, subtotal, discount, tax, grand_total, payment_method, notes, created_at, updated_at)
VALUES (
  '4f7125e6-8151-41a4-8d71-2b4828fdcc2f',
  20,
  'Salok',
  '9998076722',
  NULL,
  200,
  0,
  0,
  200,
  'Cash',
  NULL,
  '2026-06-05T10:00:00Z',
  '2026-06-05T10:00:00Z'
);

INSERT INTO billing_services (id, billing_id, name, price, quantity, service_by, staff_assignments, created_at)
VALUES (
  '5aa46a3b-4b53-42ee-a0d1-1ced1db790c9',
  '4f7125e6-8151-41a4-8d71-2b4828fdcc2f',
  'haircut',
  200,
  1,
  'Sahil',
  NULL,
  '2026-06-05T10:00:00Z'
);

-- Billing #21: Kinjal
INSERT INTO billings (id, serial_number, customer_name, mobile_number, customer_gender, subtotal, discount, tax, grand_total, payment_method, notes, created_at, updated_at)
VALUES (
  'f520cbd0-dfee-483f-970b-d3db825869cc',
  21,
  'Kinjal',
  '7698968914',
  NULL,
  400,
  0,
  0,
  400,
  'UPI',
  NULL,
  '2026-06-05T10:00:00Z',
  '2026-06-05T10:00:00Z'
);

INSERT INTO billing_services (id, billing_id, name, price, quantity, service_by, staff_assignments, created_at)
VALUES (
  'f7c76510-fcb6-4c38-b0ed-0ed718f51350',
  'f520cbd0-dfee-483f-970b-d3db825869cc',
  'female cut',
  400,
  1,
  'Simren',
  NULL,
  '2026-06-05T10:00:00Z'
);

-- Billing #22: Ashu
INSERT INTO billings (id, serial_number, customer_name, mobile_number, customer_gender, subtotal, discount, tax, grand_total, payment_method, notes, created_at, updated_at)
VALUES (
  '2a51eab2-cae6-4bce-b8d4-87226ae31558',
  22,
  'Ashu',
  '7046206926',
  NULL,
  100,
  0,
  0,
  100,
  'UPI',
  NULL,
  '2026-06-05T10:00:00Z',
  '2026-06-05T10:00:00Z'
);

INSERT INTO billing_services (id, billing_id, name, price, quantity, service_by, staff_assignments, created_at)
VALUES (
  '7e97295f-e994-4068-9d62-f0f57411537e',
  '2a51eab2-cae6-4bce-b8d4-87226ae31558',
  'beard',
  100,
  1,
  'Sahil',
  NULL,
  '2026-06-05T10:00:00Z'
);

-- Billing #23: Mukesh
INSERT INTO billings (id, serial_number, customer_name, mobile_number, customer_gender, subtotal, discount, tax, grand_total, payment_method, notes, created_at, updated_at)
VALUES (
  'af8ab97c-89f6-4d25-a4c3-11d0b5e6ccbb',
  23,
  'Mukesh',
  '7228816571',
  NULL,
  500,
  0,
  0,
  500,
  'UPI',
  NULL,
  '2026-06-05T10:00:00Z',
  '2026-06-05T10:00:00Z'
);

INSERT INTO billing_services (id, billing_id, name, price, quantity, service_by, staff_assignments, created_at)
VALUES (
  '3c01b8cd-e4b2-4bd0-a125-a676f132df48',
  'af8ab97c-89f6-4d25-a4c3-11d0b5e6ccbb',
  'cut+beard',
  500,
  1,
  'Sahil',
  NULL,
  '2026-06-05T10:00:00Z'
);

-- Billing #24: client
INSERT INTO billings (id, serial_number, customer_name, mobile_number, customer_gender, subtotal, discount, tax, grand_total, payment_method, notes, created_at, updated_at)
VALUES (
  '2c4fcdd9-a15d-4c1a-ad5b-7dd3c733dbe1',
  24,
  'client',
  '8347011192',
  NULL,
  100,
  0,
  0,
  100,
  'UPI',
  NULL,
  '2026-06-05T10:00:00Z',
  '2026-06-05T10:00:00Z'
);

INSERT INTO billing_services (id, billing_id, name, price, quantity, service_by, staff_assignments, created_at)
VALUES (
  'b8c0cb46-66d3-4ba4-bf6a-fe412a80eb0a',
  '2c4fcdd9-a15d-4c1a-ad5b-7dd3c733dbe1',
  'beard',
  100,
  1,
  'Sahil',
  NULL,
  '2026-06-05T10:00:00Z'
);

-- Billing #25: Abhishak
INSERT INTO billings (id, serial_number, customer_name, mobile_number, customer_gender, subtotal, discount, tax, grand_total, payment_method, notes, created_at, updated_at)
VALUES (
  '2c175594-af69-4cb2-a8a5-405d58193e7a',
  25,
  'Abhishak',
  '7043401687',
  NULL,
  500,
  0,
  0,
  500,
  'UPI',
  NULL,
  '2026-06-07T10:00:00Z',
  '2026-06-07T10:00:00Z'
);

INSERT INTO billing_services (id, billing_id, name, price, quantity, service_by, staff_assignments, created_at)
VALUES (
  '2594a513-604b-4df1-b8fe-043c005ae5ba',
  '2c175594-af69-4cb2-a8a5-405d58193e7a',
  'Combo-1',
  500,
  1,
  'Sahil',
  NULL,
  '2026-06-07T10:00:00Z'
);

-- Billing #26: Hetarth
INSERT INTO billings (id, serial_number, customer_name, mobile_number, customer_gender, subtotal, discount, tax, grand_total, payment_method, notes, created_at, updated_at)
VALUES (
  '4dbcd102-3ed4-4082-b698-76c686ce1730',
  26,
  'Hetarth',
  '8530401687',
  NULL,
  200,
  0,
  0,
  200,
  'Cash',
  NULL,
  '2026-06-07T10:00:00Z',
  '2026-06-07T10:00:00Z'
);

INSERT INTO billing_services (id, billing_id, name, price, quantity, service_by, staff_assignments, created_at)
VALUES (
  '0a716784-7c44-45b0-8c7d-20101e95b300',
  '4dbcd102-3ed4-4082-b698-76c686ce1730',
  'haircut',
  200,
  1,
  'Sahil',
  NULL,
  '2026-06-07T10:00:00Z'
);

-- Billing #27: Reena
INSERT INTO billings (id, serial_number, customer_name, mobile_number, customer_gender, subtotal, discount, tax, grand_total, payment_method, notes, created_at, updated_at)
VALUES (
  '921a2e34-9bd4-448d-a70b-dc60a6826d12',
  27,
  'Reena',
  '9099645798',
  NULL,
  200,
  0,
  0,
  200,
  'UPI',
  NULL,
  '2026-06-07T10:00:00Z',
  '2026-06-07T10:00:00Z'
);

INSERT INTO billing_services (id, billing_id, name, price, quantity, service_by, staff_assignments, created_at)
VALUES (
  '960cfae1-ff06-49cb-beec-02dd8617751a',
  '921a2e34-9bd4-448d-a70b-dc60a6826d12',
  'haircut',
  200,
  1,
  'Sahil',
  NULL,
  '2026-06-07T10:00:00Z'
);

-- Billing #28: Sunil
INSERT INTO billings (id, serial_number, customer_name, mobile_number, customer_gender, subtotal, discount, tax, grand_total, payment_method, notes, created_at, updated_at)
VALUES (
  '31deff64-31d5-44da-91be-94810a5ad386',
  28,
  'Sunil',
  '8980493911',
  NULL,
  300,
  0,
  0,
  300,
  'UPI',
  NULL,
  '2026-06-07T10:00:00Z',
  '2026-06-07T10:00:00Z'
);

INSERT INTO billing_services (id, billing_id, name, price, quantity, service_by, staff_assignments, created_at)
VALUES (
  '85cc4431-c6f9-4b15-8ed4-911485abbf20',
  '31deff64-31d5-44da-91be-94810a5ad386',
  'cut+beard',
  300,
  1,
  'Sahil',
  NULL,
  '2026-06-07T10:00:00Z'
);

-- Billing #29: Mitava
INSERT INTO billings (id, serial_number, customer_name, mobile_number, customer_gender, subtotal, discount, tax, grand_total, payment_method, notes, created_at, updated_at)
VALUES (
  'f629d9f2-955f-4611-bf64-0ba977495424',
  29,
  'Mitava',
  '9879358510',
  NULL,
  800,
  0,
  0,
  800,
  'UPI',
  NULL,
  '2026-06-07T10:00:00Z',
  '2026-06-07T10:00:00Z'
);

INSERT INTO billing_services (id, billing_id, name, price, quantity, service_by, staff_assignments, created_at)
VALUES (
  '06ced9bf-f332-48be-b60b-864611076f2e',
  'f629d9f2-955f-4611-bf64-0ba977495424',
  'Hair spa',
  800,
  1,
  'Sahil',
  NULL,
  '2026-06-07T10:00:00Z'
);

-- Billing #30: Ankita
INSERT INTO billings (id, serial_number, customer_name, mobile_number, customer_gender, subtotal, discount, tax, grand_total, payment_method, notes, created_at, updated_at)
VALUES (
  '86cfa57f-283c-4fb9-b8c7-18fe98f19a56',
  30,
  'Ankita',
  '8200972758',
  NULL,
  135,
  0,
  0,
  135,
  'UPI',
  NULL,
  '2026-06-07T10:00:00Z',
  '2026-06-07T10:00:00Z'
);

INSERT INTO billing_services (id, billing_id, name, price, quantity, service_by, staff_assignments, created_at)
VALUES (
  'ebdc05c8-656a-45c0-a226-67539586c482',
  '86cfa57f-283c-4fb9-b8c7-18fe98f19a56',
  'threading',
  135,
  1,
  'Simren',
  NULL,
  '2026-06-07T10:00:00Z'
);

-- Billing #31: Vinod
INSERT INTO billings (id, serial_number, customer_name, mobile_number, customer_gender, subtotal, discount, tax, grand_total, payment_method, notes, created_at, updated_at)
VALUES (
  'a169a191-2469-4fb1-8571-2d4da2fcd4cd',
  31,
  'Vinod',
  '9558155367',
  NULL,
  300,
  0,
  0,
  300,
  'Cash',
  NULL,
  '2026-06-07T10:00:00Z',
  '2026-06-07T10:00:00Z'
);

INSERT INTO billing_services (id, billing_id, name, price, quantity, service_by, staff_assignments, created_at)
VALUES (
  '46d9a789-c23b-4f57-85e0-6263aaf904d5',
  'a169a191-2469-4fb1-8571-2d4da2fcd4cd',
  'female cut',
  300,
  1,
  'Simren',
  NULL,
  '2026-06-07T10:00:00Z'
);

-- Billing #32: Pooja
INSERT INTO billings (id, serial_number, customer_name, mobile_number, customer_gender, subtotal, discount, tax, grand_total, payment_method, notes, created_at, updated_at)
VALUES (
  'ecd5612f-1707-43d7-846b-bc6fcd444323',
  32,
  'Pooja',
  '9724026307',
  NULL,
  3800,
  0,
  0,
  3800,
  'UPI',
  NULL,
  '2026-06-07T10:00:00Z',
  '2026-06-07T10:00:00Z'
);

INSERT INTO billing_services (id, billing_id, name, price, quantity, service_by, staff_assignments, created_at)
VALUES (
  '8acb8694-94c7-4a3b-8110-3f74acdcfe71',
  'ecd5612f-1707-43d7-846b-bc6fcd444323',
  'colou+cut+waxing',
  3800,
  1,
  'Simren',
  NULL,
  '2026-06-07T10:00:00Z'
);

-- Billing #33: rishab
INSERT INTO billings (id, serial_number, customer_name, mobile_number, customer_gender, subtotal, discount, tax, grand_total, payment_method, notes, created_at, updated_at)
VALUES (
  '5e2391ca-2364-4bc5-94e7-e25c8bf0576c',
  33,
  'rishab',
  '9285417649',
  NULL,
  300,
  0,
  0,
  300,
  'UPI',
  NULL,
  '2026-06-07T10:00:00Z',
  '2026-06-07T10:00:00Z'
);

INSERT INTO billing_services (id, billing_id, name, price, quantity, service_by, staff_assignments, created_at)
VALUES (
  'a4c233a9-fc25-4820-a12d-5b541884e2ae',
  '5e2391ca-2364-4bc5-94e7-e25c8bf0576c',
  'cut+beard',
  300,
  1,
  'Sahil',
  NULL,
  '2026-06-07T10:00:00Z'
);

-- Billing #34: Ranjeet
INSERT INTO billings (id, serial_number, customer_name, mobile_number, customer_gender, subtotal, discount, tax, grand_total, payment_method, notes, created_at, updated_at)
VALUES (
  '0c60be60-a83a-4eee-bc5b-3bbe19ac4d76',
  34,
  'Ranjeet',
  '9979096063',
  NULL,
  1000,
  0,
  0,
  1000,
  'Cash',
  NULL,
  '2026-06-07T10:00:00Z',
  '2026-06-07T10:00:00Z'
);

INSERT INTO billing_services (id, billing_id, name, price, quantity, service_by, staff_assignments, created_at)
VALUES (
  'bfc340c6-bb8c-452a-b002-d6a05a505ca2',
  '0c60be60-a83a-4eee-bc5b-3bbe19ac4d76',
  'comb+color',
  1000,
  1,
  'Sahil, Simren',
  '[{"staffName":"Sahil","amount":500},{"staffName":"Simren","amount":500}]'::jsonb,
  '2026-06-07T10:00:00Z'
);

-- Billing #35: Prabhath
INSERT INTO billings (id, serial_number, customer_name, mobile_number, customer_gender, subtotal, discount, tax, grand_total, payment_method, notes, created_at, updated_at)
VALUES (
  '610f8dad-3e3d-404c-bfac-caf073c7c429',
  35,
  'Prabhath',
  '9099348666',
  NULL,
  300,
  0,
  0,
  300,
  'UPI',
  NULL,
  '2026-06-07T10:00:00Z',
  '2026-06-07T10:00:00Z'
);

INSERT INTO billing_services (id, billing_id, name, price, quantity, service_by, staff_assignments, created_at)
VALUES (
  '2f7d4c81-316d-469a-b1d2-2ae6c3846ba6',
  '610f8dad-3e3d-404c-bfac-caf073c7c429',
  'Heard massag',
  300,
  1,
  'Sahil',
  NULL,
  '2026-06-07T10:00:00Z'
);

-- Billing #36: Vipan
INSERT INTO billings (id, serial_number, customer_name, mobile_number, customer_gender, subtotal, discount, tax, grand_total, payment_method, notes, created_at, updated_at)
VALUES (
  'c8a92641-8e14-46a9-87ab-d32714ae5120',
  36,
  'Vipan',
  '9580848081',
  NULL,
  100,
  0,
  0,
  100,
  'Cash',
  NULL,
  '2026-06-07T10:00:00Z',
  '2026-06-07T10:00:00Z'
);

INSERT INTO billing_services (id, billing_id, name, price, quantity, service_by, staff_assignments, created_at)
VALUES (
  '6e437067-ab18-4b64-8bbe-030e9dd4f230',
  'c8a92641-8e14-46a9-87ab-d32714ae5120',
  'beard',
  100,
  1,
  'Sahil',
  NULL,
  '2026-06-07T10:00:00Z'
);

-- Billing #37: fanny
INSERT INTO billings (id, serial_number, customer_name, mobile_number, customer_gender, subtotal, discount, tax, grand_total, payment_method, notes, created_at, updated_at)
VALUES (
  '96c1b69a-c9d8-48b5-8e0b-44c9cdb4997a',
  37,
  'fanny',
  '8320136841',
  NULL,
  200,
  0,
  0,
  200,
  'UPI',
  NULL,
  '2026-06-08T10:00:00Z',
  '2026-06-08T10:00:00Z'
);

INSERT INTO billing_services (id, billing_id, name, price, quantity, service_by, staff_assignments, created_at)
VALUES (
  '32eb89eb-5628-4d50-8536-564fbb198456',
  '96c1b69a-c9d8-48b5-8e0b-44c9cdb4997a',
  'Hair cut',
  200,
  1,
  'Simren',
  NULL,
  '2026-06-08T10:00:00Z'
);

-- Billing #38: Fanil
INSERT INTO billings (id, serial_number, customer_name, mobile_number, customer_gender, subtotal, discount, tax, grand_total, payment_method, notes, created_at, updated_at)
VALUES (
  'ea1d847e-a906-4a66-8b4f-bc35ffdcf3a0',
  38,
  'Fanil',
  '7575012254',
  NULL,
  100,
  0,
  0,
  100,
  'UPI',
  NULL,
  '2026-06-08T10:00:00Z',
  '2026-06-08T10:00:00Z'
);

INSERT INTO billing_services (id, billing_id, name, price, quantity, service_by, staff_assignments, created_at)
VALUES (
  '085108dc-1025-49cf-91ab-88f8b0fef485',
  'ea1d847e-a906-4a66-8b4f-bc35ffdcf3a0',
  'beard',
  100,
  1,
  'Sahil',
  NULL,
  '2026-06-08T10:00:00Z'
);

-- Billing #39: Mithan
INSERT INTO billings (id, serial_number, customer_name, mobile_number, customer_gender, subtotal, discount, tax, grand_total, payment_method, notes, created_at, updated_at)
VALUES (
  '06b04c64-504d-421b-a3b0-3452f09e8c58',
  39,
  'Mithan',
  '9316258992',
  NULL,
  200,
  0,
  0,
  200,
  'Cash',
  NULL,
  '2026-06-08T10:00:00Z',
  '2026-06-08T10:00:00Z'
);

INSERT INTO billing_services (id, billing_id, name, price, quantity, service_by, staff_assignments, created_at)
VALUES (
  '2f41c757-a84e-4be1-8187-c427e9ac93fa',
  '06b04c64-504d-421b-a3b0-3452f09e8c58',
  'Hair cut',
  200,
  1,
  'Sahil',
  NULL,
  '2026-06-08T10:00:00Z'
);

-- Billing #40: Prachi
INSERT INTO billings (id, serial_number, customer_name, mobile_number, customer_gender, subtotal, discount, tax, grand_total, payment_method, notes, created_at, updated_at)
VALUES (
  '31a5ded0-a7df-4a01-89e8-36fd768e8a1f',
  40,
  'Prachi',
  '6352071982',
  NULL,
  500,
  0,
  0,
  500,
  'Cash',
  NULL,
  '2026-06-08T10:00:00Z',
  '2026-06-08T10:00:00Z'
);

INSERT INTO billing_services (id, billing_id, name, price, quantity, service_by, staff_assignments, created_at)
VALUES (
  '7e3ab7c1-f7a6-4a66-a3b2-f69b87364c9c',
  '31a5ded0-a7df-4a01-89e8-36fd768e8a1f',
  'female cut',
  500,
  1,
  'Simren',
  NULL,
  '2026-06-08T10:00:00Z'
);

-- Billing #41: Ronak
INSERT INTO billings (id, serial_number, customer_name, mobile_number, customer_gender, subtotal, discount, tax, grand_total, payment_method, notes, created_at, updated_at)
VALUES (
  '43f2cdd3-17a8-419d-97e4-d8bb5ffa4ee2',
  41,
  'Ronak',
  '9638404285',
  NULL,
  200,
  0,
  0,
  200,
  'UPI',
  NULL,
  '2026-06-08T10:00:00Z',
  '2026-06-08T10:00:00Z'
);

INSERT INTO billing_services (id, billing_id, name, price, quantity, service_by, staff_assignments, created_at)
VALUES (
  '45acfa86-7f81-453d-9665-b35e33bd546e',
  '43f2cdd3-17a8-419d-97e4-d8bb5ffa4ee2',
  'Hair cut',
  200,
  1,
  'Sahil',
  NULL,
  '2026-06-08T10:00:00Z'
);

-- Billing #42: Taral
INSERT INTO billings (id, serial_number, customer_name, mobile_number, customer_gender, subtotal, discount, tax, grand_total, payment_method, notes, created_at, updated_at)
VALUES (
  'e54c7b51-5d9c-46d1-b1c7-55d1f009aa4d',
  42,
  'Taral',
  '9723717166',
  NULL,
  250,
  0,
  0,
  250,
  'UPI',
  NULL,
  '2026-06-08T10:00:00Z',
  '2026-06-08T10:00:00Z'
);

INSERT INTO billing_services (id, billing_id, name, price, quantity, service_by, staff_assignments, created_at)
VALUES (
  '8ce341cb-3d2e-48ac-a919-559473983917',
  'e54c7b51-5d9c-46d1-b1c7-55d1f009aa4d',
  'Hair cut+wash',
  250,
  1,
  'Sahil',
  NULL,
  '2026-06-08T10:00:00Z'
);

-- Billing #43: Heena
INSERT INTO billings (id, serial_number, customer_name, mobile_number, customer_gender, subtotal, discount, tax, grand_total, payment_method, notes, created_at, updated_at)
VALUES (
  '5bf1d619-206f-4f7c-8180-926b20c1f699',
  43,
  'Heena',
  '8320351563',
  NULL,
  890,
  0,
  0,
  890,
  'UPI',
  NULL,
  '2026-06-09T10:00:00Z',
  '2026-06-09T10:00:00Z'
);

INSERT INTO billing_services (id, billing_id, name, price, quantity, service_by, staff_assignments, created_at)
VALUES (
  '083ac389-82cc-4f2b-af2a-47ad45dd089f',
  '5bf1d619-206f-4f7c-8180-926b20c1f699',
  'Hair spa',
  890,
  1,
  'Simren',
  NULL,
  '2026-06-09T10:00:00Z'
);

-- Billing #44: Foram
INSERT INTO billings (id, serial_number, customer_name, mobile_number, customer_gender, subtotal, discount, tax, grand_total, payment_method, notes, created_at, updated_at)
VALUES (
  'd6812e03-326a-42dd-83c2-9b47e50053e3',
  44,
  'Foram',
  '9978415575',
  NULL,
  50,
  0,
  0,
  50,
  'UPI',
  NULL,
  '2026-06-09T10:00:00Z',
  '2026-06-09T10:00:00Z'
);

INSERT INTO billing_services (id, billing_id, name, price, quantity, service_by, staff_assignments, created_at)
VALUES (
  'cd690268-33c1-4227-9454-b2924d913866',
  'd6812e03-326a-42dd-83c2-9b47e50053e3',
  'threading',
  50,
  1,
  'Simren',
  NULL,
  '2026-06-09T10:00:00Z'
);

-- Billing #45: Foram
INSERT INTO billings (id, serial_number, customer_name, mobile_number, customer_gender, subtotal, discount, tax, grand_total, payment_method, notes, created_at, updated_at)
VALUES (
  '7e127118-62a9-47b5-8185-f47444b69ef7',
  45,
  'Foram',
  '9978415575',
  NULL,
  200,
  0,
  0,
  200,
  'Cash',
  NULL,
  '2026-06-09T10:00:00Z',
  '2026-06-09T10:00:00Z'
);

INSERT INTO billing_services (id, billing_id, name, price, quantity, service_by, staff_assignments, created_at)
VALUES (
  '6e6fb254-1b9e-465b-b4fb-d1cd39b27c85',
  '7e127118-62a9-47b5-8185-f47444b69ef7',
  'wash',
  200,
  1,
  'Simren',
  NULL,
  '2026-06-09T10:00:00Z'
);

-- Billing #46: Kapan
INSERT INTO billings (id, serial_number, customer_name, mobile_number, customer_gender, subtotal, discount, tax, grand_total, payment_method, notes, created_at, updated_at)
VALUES (
  'c329caf0-ebff-43eb-ab93-e02d7a2ff98f',
  46,
  'Kapan',
  '9712997127',
  NULL,
  200,
  0,
  0,
  200,
  'Cash',
  NULL,
  '2026-06-09T10:00:00Z',
  '2026-06-09T10:00:00Z'
);

INSERT INTO billing_services (id, billing_id, name, price, quantity, service_by, staff_assignments, created_at)
VALUES (
  'a0609463-cc01-4525-b263-7585b3879003',
  'c329caf0-ebff-43eb-ab93-e02d7a2ff98f',
  'Hair cut',
  200,
  1,
  'Simren',
  NULL,
  '2026-06-09T10:00:00Z'
);

-- Billing #47: Gopi
INSERT INTO billings (id, serial_number, customer_name, mobile_number, customer_gender, subtotal, discount, tax, grand_total, payment_method, notes, created_at, updated_at)
VALUES (
  '52c3918a-dd2b-44a3-b9bc-f94c61c4bef0',
  47,
  'Gopi',
  '9213540938',
  NULL,
  300,
  0,
  0,
  300,
  'Cash',
  NULL,
  '2026-06-09T10:00:00Z',
  '2026-06-09T10:00:00Z'
);

INSERT INTO billing_services (id, billing_id, name, price, quantity, service_by, staff_assignments, created_at)
VALUES (
  'd3644ca8-a3f3-4e5a-a674-b8f06b7fed0a',
  '52c3918a-dd2b-44a3-b9bc-f94c61c4bef0',
  'Hair cut',
  300,
  1,
  'Simren',
  NULL,
  '2026-06-09T10:00:00Z'
);

-- Billing #48: Rajanikat
INSERT INTO billings (id, serial_number, customer_name, mobile_number, customer_gender, subtotal, discount, tax, grand_total, payment_method, notes, created_at, updated_at)
VALUES (
  '2f2afca3-d0e2-41b3-9dbd-3f32c6de9a37',
  48,
  'Rajanikat',
  '9099919044',
  NULL,
  400,
  0,
  0,
  400,
  'UPI',
  NULL,
  '2026-06-09T10:00:00Z',
  '2026-06-09T10:00:00Z'
);

INSERT INTO billing_services (id, billing_id, name, price, quantity, service_by, staff_assignments, created_at)
VALUES (
  '4d8e9a73-6dee-4bc5-bf19-451a0aa85239',
  '2f2afca3-d0e2-41b3-9dbd-3f32c6de9a37',
  'Heard massag',
  400,
  1,
  'Sahil',
  NULL,
  '2026-06-09T10:00:00Z'
);

-- Billing #49: Yogesh
INSERT INTO billings (id, serial_number, customer_name, mobile_number, customer_gender, subtotal, discount, tax, grand_total, payment_method, notes, created_at, updated_at)
VALUES (
  '4abc5a25-ab86-4f8d-841b-672c100d8d94',
  49,
  'Yogesh',
  '9081909559',
  NULL,
  800,
  0,
  0,
  800,
  'UPI',
  NULL,
  '2026-06-09T10:00:00Z',
  '2026-06-09T10:00:00Z'
);

INSERT INTO billing_services (id, billing_id, name, price, quantity, service_by, staff_assignments, created_at)
VALUES (
  'da619f96-3418-49c1-8228-af6f27f40af7',
  '4abc5a25-ab86-4f8d-841b-672c100d8d94',
  'Hair colour',
  800,
  1,
  'Sahil',
  NULL,
  '2026-06-09T10:00:00Z'
);

-- Billing #50: Yogesh
INSERT INTO billings (id, serial_number, customer_name, mobile_number, customer_gender, subtotal, discount, tax, grand_total, payment_method, notes, created_at, updated_at)
VALUES (
  'df07f71e-60da-4f1f-bca0-70dc965b3ecf',
  50,
  'Yogesh',
  '9081909559',
  NULL,
  700,
  0,
  0,
  700,
  'UPI',
  NULL,
  '2026-06-09T10:00:00Z',
  '2026-06-09T10:00:00Z'
);

INSERT INTO billing_services (id, billing_id, name, price, quantity, service_by, staff_assignments, created_at)
VALUES (
  '28747327-5cfd-4108-95e1-f5de61dd3a37',
  'df07f71e-60da-4f1f-bca0-70dc965b3ecf',
  'hair product',
  700,
  1,
  'Simren',
  NULL,
  '2026-06-09T10:00:00Z'
);

-- Billing #51: Roshni
INSERT INTO billings (id, serial_number, customer_name, mobile_number, customer_gender, subtotal, discount, tax, grand_total, payment_method, notes, created_at, updated_at)
VALUES (
  '92aef70b-9eaf-49e7-accb-ab93140bfa3d',
  51,
  'Roshni',
  '9662841062',
  NULL,
  620,
  0,
  0,
  620,
  'UPI',
  NULL,
  '2026-06-10T10:00:00Z',
  '2026-06-10T10:00:00Z'
);

INSERT INTO billing_services (id, billing_id, name, price, quantity, service_by, staff_assignments, created_at)
VALUES (
  '85ecff54-2fec-48f9-a44d-090352472dac',
  '92aef70b-9eaf-49e7-accb-ab93140bfa3d',
  'Haircut+threading',
  620,
  1,
  'Simren',
  NULL,
  '2026-06-10T10:00:00Z'
);

-- Billing #52: Yasha
INSERT INTO billings (id, serial_number, customer_name, mobile_number, customer_gender, subtotal, discount, tax, grand_total, payment_method, notes, created_at, updated_at)
VALUES (
  'fd0ee3fd-5499-4244-8b53-e520cf3579aa',
  52,
  'Yasha',
  '8200991583',
  NULL,
  350,
  0,
  0,
  350,
  'Cash',
  NULL,
  '2026-06-10T10:00:00Z',
  '2026-06-10T10:00:00Z'
);

INSERT INTO billing_services (id, billing_id, name, price, quantity, service_by, staff_assignments, created_at)
VALUES (
  '07b90e8f-f2c0-4ca5-851d-a3dc7765c32e',
  'fd0ee3fd-5499-4244-8b53-e520cf3579aa',
  'Hair cut+beard',
  350,
  1,
  'Sahil',
  NULL,
  '2026-06-10T10:00:00Z'
);

-- Billing #53: Yasha
INSERT INTO billings (id, serial_number, customer_name, mobile_number, customer_gender, subtotal, discount, tax, grand_total, payment_method, notes, created_at, updated_at)
VALUES (
  '19eef9fa-2502-47c1-a3dc-c3b598644b79',
  53,
  'Yasha',
  '8200991583',
  NULL,
  50,
  0,
  0,
  50,
  'UPI',
  NULL,
  '2026-06-10T10:00:00Z',
  '2026-06-10T10:00:00Z'
);

INSERT INTO billing_services (id, billing_id, name, price, quantity, service_by, staff_assignments, created_at)
VALUES (
  'c3db1555-2537-4aa2-ad9e-3ceb57b5a301',
  '19eef9fa-2502-47c1-a3dc-c3b598644b79',
  'threading',
  50,
  1,
  'Simren',
  NULL,
  '2026-06-10T10:00:00Z'
);

-- Billing #54: Tejeshvi
INSERT INTO billings (id, serial_number, customer_name, mobile_number, customer_gender, subtotal, discount, tax, grand_total, payment_method, notes, created_at, updated_at)
VALUES (
  '28dd4d55-4ed2-4e62-9f80-67be5c74d2a3',
  54,
  'Tejeshvi',
  '9106268450',
  NULL,
  90,
  0,
  0,
  90,
  'Cash',
  NULL,
  '2026-06-10T10:00:00Z',
  '2026-06-10T10:00:00Z'
);

INSERT INTO billing_services (id, billing_id, name, price, quantity, service_by, staff_assignments, created_at)
VALUES (
  '389e3344-2ddf-4b84-a7c7-6917abde60a7',
  '28dd4d55-4ed2-4e62-9f80-67be5c74d2a3',
  'threading',
  90,
  1,
  'Simren',
  NULL,
  '2026-06-10T10:00:00Z'
);

-- Billing #55: Tejan
INSERT INTO billings (id, serial_number, customer_name, mobile_number, customer_gender, subtotal, discount, tax, grand_total, payment_method, notes, created_at, updated_at)
VALUES (
  '5979d30b-83ec-4de6-9abd-79952afacb39',
  55,
  'Tejan',
  '8200775336',
  NULL,
  250,
  0,
  0,
  250,
  'Cash',
  NULL,
  '2026-06-10T10:00:00Z',
  '2026-06-10T10:00:00Z'
);

INSERT INTO billing_services (id, billing_id, name, price, quantity, service_by, staff_assignments, created_at)
VALUES (
  'cd1190fd-cd23-4d43-aedf-f04b28f113f4',
  '5979d30b-83ec-4de6-9abd-79952afacb39',
  'hair cut',
  250,
  1,
  'Sahil',
  NULL,
  '2026-06-10T10:00:00Z'
);

-- Billing #56: Aachal
INSERT INTO billings (id, serial_number, customer_name, mobile_number, customer_gender, subtotal, discount, tax, grand_total, payment_method, notes, created_at, updated_at)
VALUES (
  'fa76c8ec-c3c7-4067-8a7c-ece6a14ea612',
  56,
  'Aachal',
  '9724444714',
  NULL,
  90,
  0,
  0,
  90,
  'Cash',
  NULL,
  '2026-06-10T10:00:00Z',
  '2026-06-10T10:00:00Z'
);

INSERT INTO billing_services (id, billing_id, name, price, quantity, service_by, staff_assignments, created_at)
VALUES (
  'd685a090-971d-4dd0-b341-3ec770c8ece3',
  'fa76c8ec-c3c7-4067-8a7c-ece6a14ea612',
  'threading',
  90,
  1,
  'Simren',
  NULL,
  '2026-06-10T10:00:00Z'
);

-- Billing #57: Vevaha
INSERT INTO billings (id, serial_number, customer_name, mobile_number, customer_gender, subtotal, discount, tax, grand_total, payment_method, notes, created_at, updated_at)
VALUES (
  '273b1629-4659-469c-b149-b29734513e94',
  57,
  'Vevaha',
  '9892318981',
  NULL,
  100,
  0,
  0,
  100,
  'UPI',
  NULL,
  '2026-06-10T10:00:00Z',
  '2026-06-10T10:00:00Z'
);

INSERT INTO billing_services (id, billing_id, name, price, quantity, service_by, staff_assignments, created_at)
VALUES (
  '11e7f414-3627-47a2-a345-476db98a5ea4',
  '273b1629-4659-469c-b149-b29734513e94',
  'beard',
  100,
  1,
  'Sahi',
  NULL,
  '2026-06-10T10:00:00Z'
);

-- Billing #58: Prachi
INSERT INTO billings (id, serial_number, customer_name, mobile_number, customer_gender, subtotal, discount, tax, grand_total, payment_method, notes, created_at, updated_at)
VALUES (
  'f3f5491e-b43b-40f6-8b58-5d3ac8c9e813',
  58,
  'Prachi',
  '8200824737',
  NULL,
  90,
  0,
  0,
  90,
  'UPI',
  NULL,
  '2026-06-10T10:00:00Z',
  '2026-06-10T10:00:00Z'
);

INSERT INTO billing_services (id, billing_id, name, price, quantity, service_by, staff_assignments, created_at)
VALUES (
  'dd8f63d0-9324-4695-89ee-607b19ac14fe',
  'f3f5491e-b43b-40f6-8b58-5d3ac8c9e813',
  'threading',
  90,
  1,
  'Simran',
  NULL,
  '2026-06-10T10:00:00Z'
);

-- Billing #59: NIHIL
INSERT INTO billings (id, serial_number, customer_name, mobile_number, customer_gender, subtotal, discount, tax, grand_total, payment_method, notes, created_at, updated_at)
VALUES (
  '640e2cbf-8d9d-41fd-82c2-d2b3a304df59',
  59,
  'NIHIL',
  '9825613876',
  NULL,
  500,
  0,
  0,
  500,
  'Cash',
  NULL,
  '2026-06-10T10:00:00Z',
  '2026-06-10T10:00:00Z'
);

INSERT INTO billing_services (id, billing_id, name, price, quantity, service_by, staff_assignments, created_at)
VALUES (
  '61a77225-0d05-4645-bdb0-32a63b536801',
  '640e2cbf-8d9d-41fd-82c2-d2b3a304df59',
  'Hair cut',
  500,
  1,
  'Sahil',
  NULL,
  '2026-06-10T10:00:00Z'
);

-- Billing #60: katish
INSERT INTO billings (id, serial_number, customer_name, mobile_number, customer_gender, subtotal, discount, tax, grand_total, payment_method, notes, created_at, updated_at)
VALUES (
  '74452175-1a63-4ea1-9a84-21ffe1aad763',
  60,
  'katish',
  '7300388669',
  NULL,
  200,
  0,
  0,
  200,
  'Cash',
  NULL,
  '2026-06-11T10:00:00Z',
  '2026-06-11T10:00:00Z'
);

INSERT INTO billing_services (id, billing_id, name, price, quantity, service_by, staff_assignments, created_at)
VALUES (
  'bc28b2ea-7a64-45a9-841b-f46d07c1c6cc',
  '74452175-1a63-4ea1-9a84-21ffe1aad763',
  'Hair cut',
  200,
  1,
  'Sahil',
  NULL,
  '2026-06-11T10:00:00Z'
);

-- Billing #61: lsheear
INSERT INTO billings (id, serial_number, customer_name, mobile_number, customer_gender, subtotal, discount, tax, grand_total, payment_method, notes, created_at, updated_at)
VALUES (
  'f86d96fb-714e-4505-a9a7-42bbd85dd2c8',
  61,
  'lsheear',
  '6378315433',
  NULL,
  200,
  0,
  0,
  200,
  'Cash',
  NULL,
  '2026-06-11T10:00:00Z',
  '2026-06-11T10:00:00Z'
);

INSERT INTO billing_services (id, billing_id, name, price, quantity, service_by, staff_assignments, created_at)
VALUES (
  'f02e2599-059b-43cb-a43b-03d6b4190c57',
  'f86d96fb-714e-4505-a9a7-42bbd85dd2c8',
  'Hair cut+beard',
  200,
  1,
  'Sahil',
  NULL,
  '2026-06-11T10:00:00Z'
);

-- Billing #62: satish
INSERT INTO billings (id, serial_number, customer_name, mobile_number, customer_gender, subtotal, discount, tax, grand_total, payment_method, notes, created_at, updated_at)
VALUES (
  'f0ef0366-3baf-423c-beaf-fed02b9fc7c9',
  62,
  'satish',
  '9924466720',
  NULL,
  100,
  0,
  0,
  100,
  'UPI',
  NULL,
  '2026-06-11T10:00:00Z',
  '2026-06-11T10:00:00Z'
);

INSERT INTO billing_services (id, billing_id, name, price, quantity, service_by, staff_assignments, created_at)
VALUES (
  'dcca43e4-8585-451a-8dfa-659663cfd9c6',
  'f0ef0366-3baf-423c-beaf-fed02b9fc7c9',
  'beard',
  100,
  1,
  'Sahil',
  NULL,
  '2026-06-11T10:00:00Z'
);

-- Billing #63: Naresh
INSERT INTO billings (id, serial_number, customer_name, mobile_number, customer_gender, subtotal, discount, tax, grand_total, payment_method, notes, created_at, updated_at)
VALUES (
  '221ea1e6-8969-45fb-a438-18b943ca5080',
  63,
  'Naresh',
  '9825784561',
  NULL,
  200,
  0,
  0,
  200,
  'UPI',
  NULL,
  '2026-06-11T10:00:00Z',
  '2026-06-11T10:00:00Z'
);

INSERT INTO billing_services (id, billing_id, name, price, quantity, service_by, staff_assignments, created_at)
VALUES (
  '97ce2019-73f8-4616-861c-a6abfa124321',
  '221ea1e6-8969-45fb-a438-18b943ca5080',
  'Hair cut',
  200,
  1,
  'Sahil',
  NULL,
  '2026-06-11T10:00:00Z'
);

-- Billing #64: client
INSERT INTO billings (id, serial_number, customer_name, mobile_number, customer_gender, subtotal, discount, tax, grand_total, payment_method, notes, created_at, updated_at)
VALUES (
  '7e6ad0ed-8915-41b3-a385-40bc2d389fad',
  64,
  'client',
  '0000000000',
  NULL,
  300,
  0,
  0,
  300,
  'UPI',
  NULL,
  '2026-06-12T10:00:00Z',
  '2026-06-12T10:00:00Z'
);

INSERT INTO billing_services (id, billing_id, name, price, quantity, service_by, staff_assignments, created_at)
VALUES (
  '2a2625a1-f7ba-4d2f-b5ee-6ef7fb2879b2',
  '7e6ad0ed-8915-41b3-a385-40bc2d389fad',
  'Hair cut beard',
  300,
  1,
  'Sahil',
  NULL,
  '2026-06-12T10:00:00Z'
);

-- Billing #65: client
INSERT INTO billings (id, serial_number, customer_name, mobile_number, customer_gender, subtotal, discount, tax, grand_total, payment_method, notes, created_at, updated_at)
VALUES (
  '9a3d7fac-e175-4bda-8d14-27580cae97ad',
  65,
  'client',
  '0000000000',
  NULL,
  100,
  0,
  0,
  100,
  'UPI',
  NULL,
  '2026-06-12T10:00:00Z',
  '2026-06-12T10:00:00Z'
);

INSERT INTO billing_services (id, billing_id, name, price, quantity, service_by, staff_assignments, created_at)
VALUES (
  '5ab7fbda-e637-44f4-bb67-87864547fd12',
  '9a3d7fac-e175-4bda-8d14-27580cae97ad',
  'beard',
  100,
  1,
  'Sahil',
  NULL,
  '2026-06-12T10:00:00Z'
);

-- Billing #66: Mukesh
INSERT INTO billings (id, serial_number, customer_name, mobile_number, customer_gender, subtotal, discount, tax, grand_total, payment_method, notes, created_at, updated_at)
VALUES (
  '17f75413-d5e9-48c9-836c-8375a3f8b51a',
  66,
  'Mukesh',
  '0000000000',
  NULL,
  100,
  0,
  0,
  100,
  'Cash',
  NULL,
  '2026-06-12T10:00:00Z',
  '2026-06-12T10:00:00Z'
);

INSERT INTO billing_services (id, billing_id, name, price, quantity, service_by, staff_assignments, created_at)
VALUES (
  '440f0b28-44c5-457a-8b19-62febc8ff258',
  '17f75413-d5e9-48c9-836c-8375a3f8b51a',
  'beard',
  100,
  1,
  'Sahil',
  NULL,
  '2026-06-12T10:00:00Z'
);

-- Billing #67: manisha
INSERT INTO billings (id, serial_number, customer_name, mobile_number, customer_gender, subtotal, discount, tax, grand_total, payment_method, notes, created_at, updated_at)
VALUES (
  '478901fa-d55b-42d2-a106-806b3b16557d',
  67,
  'manisha',
  '9723709106',
  NULL,
  400,
  0,
  0,
  400,
  'Cash',
  NULL,
  '2026-06-12T10:00:00Z',
  '2026-06-12T10:00:00Z'
);

INSERT INTO billing_services (id, billing_id, name, price, quantity, service_by, staff_assignments, created_at)
VALUES (
  '286b1480-4580-43a3-8922-2b946184ab3d',
  '478901fa-d55b-42d2-a106-806b3b16557d',
  'Hair cut',
  400,
  1,
  'Simran',
  NULL,
  '2026-06-12T10:00:00Z'
);

-- Billing #68: shalin
INSERT INTO billings (id, serial_number, customer_name, mobile_number, customer_gender, subtotal, discount, tax, grand_total, payment_method, notes, created_at, updated_at)
VALUES (
  '08a0ea72-47b0-4bc5-aeca-1e3af88157f7',
  68,
  'shalin',
  '9173570221',
  NULL,
  150,
  0,
  0,
  150,
  'UPI',
  NULL,
  '2026-06-12T10:00:00Z',
  '2026-06-12T10:00:00Z'
);

INSERT INTO billing_services (id, billing_id, name, price, quantity, service_by, staff_assignments, created_at)
VALUES (
  '6cb7536a-6262-456e-a713-be41997cc2da',
  '08a0ea72-47b0-4bc5-aeca-1e3af88157f7',
  'beard',
  150,
  1,
  'Sahil',
  NULL,
  '2026-06-12T10:00:00Z'
);

-- Billing #69: Ramila
INSERT INTO billings (id, serial_number, customer_name, mobile_number, customer_gender, subtotal, discount, tax, grand_total, payment_method, notes, created_at, updated_at)
VALUES (
  '8a6202a8-57f9-4bc9-af2c-01db4dbe0add',
  69,
  'Ramila',
  '9099713178',
  NULL,
  450,
  0,
  0,
  450,
  'Cash',
  NULL,
  '2026-06-12T10:00:00Z',
  '2026-06-12T10:00:00Z'
);

INSERT INTO billing_services (id, billing_id, name, price, quantity, service_by, staff_assignments, created_at)
VALUES (
  '7ee823cb-cf3e-4e95-82bc-58b87340228c',
  '8a6202a8-57f9-4bc9-af2c-01db4dbe0add',
  'cut+waxing',
  450,
  1,
  'Simran',
  NULL,
  '2026-06-12T10:00:00Z'
);

-- Billing #70: client
INSERT INTO billings (id, serial_number, customer_name, mobile_number, customer_gender, subtotal, discount, tax, grand_total, payment_method, notes, created_at, updated_at)
VALUES (
  '17dda99c-9eb5-4f73-b915-d8d2fd1f8e7a',
  70,
  'client',
  '0000000000',
  NULL,
  300,
  0,
  0,
  300,
  'UPI',
  NULL,
  '2026-06-12T10:00:00Z',
  '2026-06-12T10:00:00Z'
);

INSERT INTO billing_services (id, billing_id, name, price, quantity, service_by, staff_assignments, created_at)
VALUES (
  '718267d1-9e3d-4085-9ec6-84da4b6f7d4a',
  '17dda99c-9eb5-4f73-b915-d8d2fd1f8e7a',
  'cut+beard',
  300,
  1,
  'Sahil',
  NULL,
  '2026-06-12T10:00:00Z'
);

-- Billing #71: client
INSERT INTO billings (id, serial_number, customer_name, mobile_number, customer_gender, subtotal, discount, tax, grand_total, payment_method, notes, created_at, updated_at)
VALUES (
  '4fd5aae9-dba3-447c-a89b-b34e163535af',
  71,
  'client',
  '0000000000',
  NULL,
  500,
  0,
  0,
  500,
  'UPI',
  NULL,
  '2026-06-12T10:00:00Z',
  '2026-06-12T10:00:00Z'
);

INSERT INTO billing_services (id, billing_id, name, price, quantity, service_by, staff_assignments, created_at)
VALUES (
  'a51dfb42-1513-4244-b778-cf8f16337724',
  '4fd5aae9-dba3-447c-a89b-b34e163535af',
  'combo-1',
  500,
  1,
  'Sahil',
  NULL,
  '2026-06-12T10:00:00Z'
);

-- Billing #72: Rudra
INSERT INTO billings (id, serial_number, customer_name, mobile_number, customer_gender, subtotal, discount, tax, grand_total, payment_method, notes, created_at, updated_at)
VALUES (
  '9d773714-0457-4886-ba93-86d0a0ecf25b',
  72,
  'Rudra',
  '9888378288',
  NULL,
  150,
  0,
  0,
  150,
  'UPI',
  NULL,
  '2026-06-13T10:00:00Z',
  '2026-06-13T10:00:00Z'
);

INSERT INTO billing_services (id, billing_id, name, price, quantity, service_by, staff_assignments, created_at)
VALUES (
  '9c17183e-65cb-4ebe-b110-23d739991f2b',
  '9d773714-0457-4886-ba93-86d0a0ecf25b',
  'beard',
  150,
  1,
  'Sahil',
  NULL,
  '2026-06-13T10:00:00Z'
);

-- Billing #73: Shivam
INSERT INTO billings (id, serial_number, customer_name, mobile_number, customer_gender, subtotal, discount, tax, grand_total, payment_method, notes, created_at, updated_at)
VALUES (
  'def5879c-6a8f-4122-b6a6-4c9c5fb4ad4b',
  73,
  'Shivam',
  '9990449594',
  NULL,
  700,
  0,
  0,
  700,
  'UPI',
  NULL,
  '2026-06-13T10:00:00Z',
  '2026-06-13T10:00:00Z'
);

INSERT INTO billing_services (id, billing_id, name, price, quantity, service_by, staff_assignments, created_at)
VALUES (
  'd6a96f7b-0fac-422e-b6d8-8d79325a4215',
  'def5879c-6a8f-4122-b6a6-4c9c5fb4ad4b',
  'combo-2',
  700,
  1,
  'Sahil',
  NULL,
  '2026-06-13T10:00:00Z'
);

-- Billing #74: Vraj
INSERT INTO billings (id, serial_number, customer_name, mobile_number, customer_gender, subtotal, discount, tax, grand_total, payment_method, notes, created_at, updated_at)
VALUES (
  'f677d701-d672-4692-b342-ecf7a64657ed',
  74,
  'Vraj',
  '9016907987',
  NULL,
  600,
  0,
  0,
  600,
  'UPI',
  NULL,
  '2026-06-13T10:00:00Z',
  '2026-06-13T10:00:00Z'
);

INSERT INTO billing_services (id, billing_id, name, price, quantity, service_by, staff_assignments, created_at)
VALUES (
  '72a9eb00-c8d2-4007-b382-adfb4332c573',
  'f677d701-d672-4692-b342-ecf7a64657ed',
  'comb-1',
  600,
  1,
  'Sahil',
  NULL,
  '2026-06-13T10:00:00Z'
);

-- Billing #75: Pooja
INSERT INTO billings (id, serial_number, customer_name, mobile_number, customer_gender, subtotal, discount, tax, grand_total, payment_method, notes, created_at, updated_at)
VALUES (
  'aafaad85-8dd0-473f-a308-6775361e41e9',
  75,
  'Pooja',
  '9724026307',
  NULL,
  1000,
  0,
  0,
  1000,
  'Cash',
  NULL,
  '2026-06-13T10:00:00Z',
  '2026-06-13T10:00:00Z'
);

INSERT INTO billing_services (id, billing_id, name, price, quantity, service_by, staff_assignments, created_at)
VALUES (
  'fa2c21e8-31cb-41ba-a3b1-e81c143af7e5',
  'aafaad85-8dd0-473f-a308-6775361e41e9',
  '3 hair wash',
  1000,
  1,
  'Simran',
  NULL,
  '2026-06-13T10:00:00Z'
);

-- Billing #76: Nisha
INSERT INTO billings (id, serial_number, customer_name, mobile_number, customer_gender, subtotal, discount, tax, grand_total, payment_method, notes, created_at, updated_at)
VALUES (
  'd212d4a1-87a6-477a-b481-b0822bf85806',
  76,
  'Nisha',
  '6353861408',
  NULL,
  250,
  0,
  0,
  250,
  'Cash',
  NULL,
  '2026-06-13T10:00:00Z',
  '2026-06-13T10:00:00Z'
);

INSERT INTO billing_services (id, billing_id, name, price, quantity, service_by, staff_assignments, created_at)
VALUES (
  '72b41a54-c1f0-48ed-b3d1-c2e331e91163',
  'd212d4a1-87a6-477a-b481-b0822bf85806',
  'cut+threading',
  250,
  1,
  'Simran',
  NULL,
  '2026-06-13T10:00:00Z'
);

-- Billing #77: Pooja
INSERT INTO billings (id, serial_number, customer_name, mobile_number, customer_gender, subtotal, discount, tax, grand_total, payment_method, notes, created_at, updated_at)
VALUES (
  '0a5ae943-7035-46b0-b3de-1611e3042833',
  77,
  'Pooja',
  '9724026307',
  NULL,
  200,
  0,
  0,
  200,
  'UPI',
  NULL,
  '2026-06-13T10:00:00Z',
  '2026-06-13T10:00:00Z'
);

INSERT INTO billing_services (id, billing_id, name, price, quantity, service_by, staff_assignments, created_at)
VALUES (
  '5438b5dd-c759-412c-a699-c1539eb6b003',
  '0a5ae943-7035-46b0-b3de-1611e3042833',
  'hair wash',
  200,
  1,
  'Simran',
  NULL,
  '2026-06-13T10:00:00Z'
);

-- Billing #78: Harie
INSERT INTO billings (id, serial_number, customer_name, mobile_number, customer_gender, subtotal, discount, tax, grand_total, payment_method, notes, created_at, updated_at)
VALUES (
  '5d1923b5-8e26-4dd4-b56e-f69611a757e3',
  78,
  'Harie',
  '0000000000',
  NULL,
  200,
  0,
  0,
  200,
  'Cash',
  NULL,
  '2026-06-13T10:00:00Z',
  '2026-06-13T10:00:00Z'
);

INSERT INTO billing_services (id, billing_id, name, price, quantity, service_by, staff_assignments, created_at)
VALUES (
  '54f6b39b-2db9-4ee7-958d-e8a9772e8e29',
  '5d1923b5-8e26-4dd4-b56e-f69611a757e3',
  'hair cut',
  200,
  1,
  'Sahil',
  NULL,
  '2026-06-13T10:00:00Z'
);

-- Billing #79: Kiran
INSERT INTO billings (id, serial_number, customer_name, mobile_number, customer_gender, subtotal, discount, tax, grand_total, payment_method, notes, created_at, updated_at)
VALUES (
  '7029940e-74e2-44ab-9ca6-d733a75cf9d5',
  79,
  'Kiran',
  '9924489346',
  NULL,
  500,
  0,
  0,
  500,
  'Cash',
  NULL,
  '2026-06-13T10:00:00Z',
  '2026-06-13T10:00:00Z'
);

INSERT INTO billing_services (id, billing_id, name, price, quantity, service_by, staff_assignments, created_at)
VALUES (
  '6936c4fe-3bf2-4ed1-92af-25b9f64e8036',
  '7029940e-74e2-44ab-9ca6-d733a75cf9d5',
  'styling',
  500,
  1,
  'Simran',
  NULL,
  '2026-06-13T10:00:00Z'
);

-- Billing #80: Ishwar
INSERT INTO billings (id, serial_number, customer_name, mobile_number, customer_gender, subtotal, discount, tax, grand_total, payment_method, notes, created_at, updated_at)
VALUES (
  '44ab6006-1d91-4879-88c2-bb2159af98f9',
  80,
  'Ishwar',
  '6378315433',
  NULL,
  1200,
  0,
  0,
  1200,
  'Cash',
  NULL,
  '2026-06-13T10:00:00Z',
  '2026-06-13T10:00:00Z'
);

INSERT INTO billing_services (id, billing_id, name, price, quantity, service_by, staff_assignments, created_at)
VALUES (
  '9f2b7304-99d2-44ce-8cd4-129d92bbde0c',
  '44ab6006-1d91-4879-88c2-bb2159af98f9',
  'hair keartin',
  1200,
  1,
  'Sahil',
  NULL,
  '2026-06-13T10:00:00Z'
);

-- Billing #81: Jayesh
INSERT INTO billings (id, serial_number, customer_name, mobile_number, customer_gender, subtotal, discount, tax, grand_total, payment_method, notes, created_at, updated_at)
VALUES (
  'a2d5a1ed-b146-4e63-b5df-1c5318285c3d',
  81,
  'Jayesh',
  '7374673756',
  NULL,
  100,
  0,
  0,
  100,
  'Cash',
  NULL,
  '2026-06-14T10:00:00Z',
  '2026-06-14T10:00:00Z'
);

INSERT INTO billing_services (id, billing_id, name, price, quantity, service_by, staff_assignments, created_at)
VALUES (
  '40d57693-829b-4197-83df-3aefe27bdc72',
  'a2d5a1ed-b146-4e63-b5df-1c5318285c3d',
  'beard',
  100,
  1,
  'Sahil',
  NULL,
  '2026-06-14T10:00:00Z'
);

-- Billing #82: Narender
INSERT INTO billings (id, serial_number, customer_name, mobile_number, customer_gender, subtotal, discount, tax, grand_total, payment_method, notes, created_at, updated_at)
VALUES (
  'c84896cb-71e7-4b82-8d8b-65bad0f5d6e6',
  82,
  'Narender',
  '9825325201',
  NULL,
  200,
  0,
  0,
  200,
  'Cash',
  NULL,
  '2026-06-14T10:00:00Z',
  '2026-06-14T10:00:00Z'
);

INSERT INTO billing_services (id, billing_id, name, price, quantity, service_by, staff_assignments, created_at)
VALUES (
  '01569fda-89a1-4dad-91f9-c494132d2346',
  'c84896cb-71e7-4b82-8d8b-65bad0f5d6e6',
  'hair cut',
  200,
  1,
  'Sahil',
  NULL,
  '2026-06-14T10:00:00Z'
);

-- Billing #83: Yogesh
INSERT INTO billings (id, serial_number, customer_name, mobile_number, customer_gender, subtotal, discount, tax, grand_total, payment_method, notes, created_at, updated_at)
VALUES (
  '3ffbbc8c-e508-40e6-8f54-5f4dc22b4987',
  83,
  'Yogesh',
  '9714355343',
  NULL,
  200,
  0,
  0,
  200,
  'UPI',
  NULL,
  '2026-06-14T10:00:00Z',
  '2026-06-14T10:00:00Z'
);

INSERT INTO billing_services (id, billing_id, name, price, quantity, service_by, staff_assignments, created_at)
VALUES (
  '962301d1-a8d5-4355-bc22-f1cf1964f3f3',
  '3ffbbc8c-e508-40e6-8f54-5f4dc22b4987',
  'hair cut',
  200,
  1,
  'Sahil',
  NULL,
  '2026-06-14T10:00:00Z'
);

-- Billing #84: shweeta
INSERT INTO billings (id, serial_number, customer_name, mobile_number, customer_gender, subtotal, discount, tax, grand_total, payment_method, notes, created_at, updated_at)
VALUES (
  '9ad5bc9b-e193-4c82-a33a-fd71f173f5f0',
  84,
  'shweeta',
  '9408018483',
  NULL,
  400,
  0,
  0,
  400,
  'Cash',
  NULL,
  '2026-06-14T10:00:00Z',
  '2026-06-14T10:00:00Z'
);

INSERT INTO billing_services (id, billing_id, name, price, quantity, service_by, staff_assignments, created_at)
VALUES (
  'b3e09a64-b5af-46e7-a558-e880d8315175',
  '9ad5bc9b-e193-4c82-a33a-fd71f173f5f0',
  'hair cut',
  400,
  1,
  'Rahul',
  NULL,
  '2026-06-14T10:00:00Z'
);

-- Billing #85: Aakash
INSERT INTO billings (id, serial_number, customer_name, mobile_number, customer_gender, subtotal, discount, tax, grand_total, payment_method, notes, created_at, updated_at)
VALUES (
  'da0b96b4-dcef-43c2-a578-9c2bdcef804c',
  85,
  'Aakash',
  '0000000000',
  NULL,
  100,
  0,
  0,
  100,
  'Cash',
  NULL,
  '2026-06-14T10:00:00Z',
  '2026-06-14T10:00:00Z'
);

INSERT INTO billing_services (id, billing_id, name, price, quantity, service_by, staff_assignments, created_at)
VALUES (
  'a216b6c2-5fed-421e-9072-8e9bd75b57af',
  'da0b96b4-dcef-43c2-a578-9c2bdcef804c',
  'beard',
  100,
  1,
  'Sahil',
  NULL,
  '2026-06-14T10:00:00Z'
);

-- Billing #86: Bijal
INSERT INTO billings (id, serial_number, customer_name, mobile_number, customer_gender, subtotal, discount, tax, grand_total, payment_method, notes, created_at, updated_at)
VALUES (
  '0d61716a-0039-483a-951a-9dbd8a752560',
  86,
  'Bijal',
  '7284925561',
  NULL,
  500,
  0,
  0,
  500,
  'UPI',
  NULL,
  '2026-06-14T10:00:00Z',
  '2026-06-14T10:00:00Z'
);

INSERT INTO billing_services (id, billing_id, name, price, quantity, service_by, staff_assignments, created_at)
VALUES (
  '4c981e41-0227-40f9-8c54-faf0bac1e13b',
  '0d61716a-0039-483a-951a-9dbd8a752560',
  'Hair colour',
  500,
  1,
  'Simren',
  NULL,
  '2026-06-14T10:00:00Z'
);

-- Billing #87: Mehul
INSERT INTO billings (id, serial_number, customer_name, mobile_number, customer_gender, subtotal, discount, tax, grand_total, payment_method, notes, created_at, updated_at)
VALUES (
  '90a6fcaa-d43f-45b7-b1fe-386f0d4e19e6',
  87,
  'Mehul',
  '9714598101',
  NULL,
  200,
  0,
  0,
  200,
  'Cash',
  NULL,
  '2026-06-14T10:00:00Z',
  '2026-06-14T10:00:00Z'
);

INSERT INTO billing_services (id, billing_id, name, price, quantity, service_by, staff_assignments, created_at)
VALUES (
  'fb085cef-0765-4982-9657-6654e167c39d',
  '90a6fcaa-d43f-45b7-b1fe-386f0d4e19e6',
  'hair cut',
  200,
  1,
  'Sahil',
  NULL,
  '2026-06-14T10:00:00Z'
);

-- Billing #88: Vishanu
INSERT INTO billings (id, serial_number, customer_name, mobile_number, customer_gender, subtotal, discount, tax, grand_total, payment_method, notes, created_at, updated_at)
VALUES (
  '59624cc5-e436-4131-983d-8fe92833b468',
  88,
  'Vishanu',
  '7874310534',
  NULL,
  500,
  0,
  0,
  500,
  'Cash',
  NULL,
  '2026-06-14T10:00:00Z',
  '2026-06-14T10:00:00Z'
);

INSERT INTO billing_services (id, billing_id, name, price, quantity, service_by, staff_assignments, created_at)
VALUES (
  '862b3979-6f60-42d1-a8bc-06c130e42af9',
  '59624cc5-e436-4131-983d-8fe92833b468',
  'Combo-1',
  500,
  1,
  'Sahil',
  NULL,
  '2026-06-14T10:00:00Z'
);

-- Billing #89: Vishanu
INSERT INTO billings (id, serial_number, customer_name, mobile_number, customer_gender, subtotal, discount, tax, grand_total, payment_method, notes, created_at, updated_at)
VALUES (
  'b9d3d476-8c8d-4de1-a5ef-f2892193cb5c',
  89,
  'Vishanu',
  '7874310534',
  NULL,
  100,
  0,
  0,
  100,
  'UPI',
  NULL,
  '2026-06-14T10:00:00Z',
  '2026-06-14T10:00:00Z'
);

INSERT INTO billing_services (id, billing_id, name, price, quantity, service_by, staff_assignments, created_at)
VALUES (
  '13478e10-e73c-4ee8-834c-38689968093c',
  'b9d3d476-8c8d-4de1-a5ef-f2892193cb5c',
  'beard',
  100,
  1,
  'Sahil',
  NULL,
  '2026-06-14T10:00:00Z'
);

-- Billing #90: Vijay
INSERT INTO billings (id, serial_number, customer_name, mobile_number, customer_gender, subtotal, discount, tax, grand_total, payment_method, notes, created_at, updated_at)
VALUES (
  '7f0b89be-7c11-4a72-8500-1cde3df70326',
  90,
  'Vijay',
  '8209617743',
  NULL,
  300,
  0,
  0,
  300,
  'Cash',
  NULL,
  '2026-06-14T10:00:00Z',
  '2026-06-14T10:00:00Z'
);

INSERT INTO billing_services (id, billing_id, name, price, quantity, service_by, staff_assignments, created_at)
VALUES (
  'f9ca62b0-554b-423c-852e-f701333c122a',
  '7f0b89be-7c11-4a72-8500-1cde3df70326',
  'cut+beard',
  300,
  1,
  'Sahil',
  NULL,
  '2026-06-14T10:00:00Z'
);

-- Billing #91: Neerwa
INSERT INTO billings (id, serial_number, customer_name, mobile_number, customer_gender, subtotal, discount, tax, grand_total, payment_method, notes, created_at, updated_at)
VALUES (
  '89d212fd-d8c2-465a-8cb1-3c2c55e001f7',
  91,
  'Neerwa',
  '9228834172',
  NULL,
  700,
  0,
  0,
  700,
  'UPI',
  NULL,
  '2026-06-14T10:00:00Z',
  '2026-06-14T10:00:00Z'
);

INSERT INTO billing_services (id, billing_id, name, price, quantity, service_by, staff_assignments, created_at)
VALUES (
  '77e48394-7a26-4deb-9b08-29f5e9a483d1',
  '89d212fd-d8c2-465a-8cb1-3c2c55e001f7',
  'colou+beard',
  700,
  1,
  'Sahil',
  NULL,
  '2026-06-14T10:00:00Z'
);

-- Billing #92: Yogesh
INSERT INTO billings (id, serial_number, customer_name, mobile_number, customer_gender, subtotal, discount, tax, grand_total, payment_method, notes, created_at, updated_at)
VALUES (
  'a902ce0b-2594-482d-bf06-92c74d8d182a',
  92,
  'Yogesh',
  '9081909559',
  NULL,
  300,
  0,
  0,
  300,
  'Cash',
  NULL,
  '2026-06-14T10:00:00Z',
  '2026-06-14T10:00:00Z'
);

INSERT INTO billing_services (id, billing_id, name, price, quantity, service_by, staff_assignments, created_at)
VALUES (
  'bf7e12ad-9ad4-498a-91a0-a01880696dee',
  'a902ce0b-2594-482d-bf06-92c74d8d182a',
  'wash+threading',
  300,
  1,
  'Simren',
  NULL,
  '2026-06-14T10:00:00Z'
);

-- Billing #93: Kinjal
INSERT INTO billings (id, serial_number, customer_name, mobile_number, customer_gender, subtotal, discount, tax, grand_total, payment_method, notes, created_at, updated_at)
VALUES (
  'ae97c293-8371-4ac8-bdd4-1dc8285e6055',
  93,
  'Kinjal',
  '6352375387',
  NULL,
  300,
  0,
  0,
  300,
  'Cash',
  NULL,
  '2026-06-14T10:00:00Z',
  '2026-06-14T10:00:00Z'
);

INSERT INTO billing_services (id, billing_id, name, price, quantity, service_by, staff_assignments, created_at)
VALUES (
  '40ffea38-e689-455a-82b8-b30fffd166d0',
  'ae97c293-8371-4ac8-bdd4-1dc8285e6055',
  'hair cut',
  300,
  1,
  'Simren',
  NULL,
  '2026-06-14T10:00:00Z'
);

-- Billing #94: Houny
INSERT INTO billings (id, serial_number, customer_name, mobile_number, customer_gender, subtotal, discount, tax, grand_total, payment_method, notes, created_at, updated_at)
VALUES (
  '7e0009f3-06e9-4783-9420-11ed556d8d7a',
  94,
  'Houny',
  '8980227055',
  NULL,
  500,
  0,
  0,
  500,
  'UPI',
  NULL,
  '2026-06-14T10:00:00Z',
  '2026-06-14T10:00:00Z'
);

INSERT INTO billing_services (id, billing_id, name, price, quantity, service_by, staff_assignments, created_at)
VALUES (
  'de1f7c40-a2b8-48a9-aa25-9734960c77ac',
  '7e0009f3-06e9-4783-9420-11ed556d8d7a',
  'hair cut',
  500,
  1,
  'Simren',
  NULL,
  '2026-06-14T10:00:00Z'
);

-- Billing #95: client
INSERT INTO billings (id, serial_number, customer_name, mobile_number, customer_gender, subtotal, discount, tax, grand_total, payment_method, notes, created_at, updated_at)
VALUES (
  'e78b8f18-b87e-435e-a451-eff6c2b8f3a8',
  95,
  'client',
  '0000000000',
  NULL,
  1200,
  0,
  0,
  1200,
  'UPI',
  NULL,
  '2026-06-15T10:00:00Z',
  '2026-06-15T10:00:00Z'
);

INSERT INTO billing_services (id, billing_id, name, price, quantity, service_by, staff_assignments, created_at)
VALUES (
  'c82da09a-b647-40de-9fc3-b01ab09509b9',
  'e78b8f18-b87e-435e-a451-eff6c2b8f3a8',
  'combo-1',
  1200,
  1,
  'Sahil',
  NULL,
  '2026-06-15T10:00:00Z'
);

-- Billing #96: Ronak
INSERT INTO billings (id, serial_number, customer_name, mobile_number, customer_gender, subtotal, discount, tax, grand_total, payment_method, notes, created_at, updated_at)
VALUES (
  '4fd04726-5a0e-499b-9811-d1bbba550d26',
  96,
  'Ronak',
  '9638404285',
  NULL,
  100,
  0,
  0,
  100,
  'UPI',
  NULL,
  '2026-06-16T10:00:00Z',
  '2026-06-16T10:00:00Z'
);

INSERT INTO billing_services (id, billing_id, name, price, quantity, service_by, staff_assignments, created_at)
VALUES (
  '2f56d8b0-a85d-485e-80f2-753240f938f1',
  '4fd04726-5a0e-499b-9811-d1bbba550d26',
  'beard',
  100,
  1,
  'Sahil',
  NULL,
  '2026-06-16T10:00:00Z'
);

-- Billing #97: Nikhil
INSERT INTO billings (id, serial_number, customer_name, mobile_number, customer_gender, subtotal, discount, tax, grand_total, payment_method, notes, created_at, updated_at)
VALUES (
  'a8c4fc6d-915e-44b4-ba58-f44d5680df7f',
  97,
  'Nikhil',
  '7623060586',
  NULL,
  300,
  0,
  0,
  300,
  'Cash',
  NULL,
  '2026-06-16T10:00:00Z',
  '2026-06-16T10:00:00Z'
);

INSERT INTO billing_services (id, billing_id, name, price, quantity, service_by, staff_assignments, created_at)
VALUES (
  'f09fd5a2-5ce3-4086-94a9-b4fe13cd6a72',
  'a8c4fc6d-915e-44b4-ba58-f44d5680df7f',
  'cut+beard',
  300,
  1,
  'Sahil',
  NULL,
  '2026-06-16T10:00:00Z'
);

-- Billing #98: Swati
INSERT INTO billings (id, serial_number, customer_name, mobile_number, customer_gender, subtotal, discount, tax, grand_total, payment_method, notes, created_at, updated_at)
VALUES (
  '46f58b50-ba89-4204-8a28-6af02fe19b3f',
  98,
  'Swati',
  '9978459719',
  NULL,
  4500,
  0,
  0,
  4500,
  'UPI',
  NULL,
  '2026-06-16T10:00:00Z',
  '2026-06-16T10:00:00Z'
);

INSERT INTO billing_services (id, billing_id, name, price, quantity, service_by, staff_assignments, created_at)
VALUES (
  '9e9e6b25-a3e4-4b84-9829-3d795698f533',
  '46f58b50-ba89-4204-8a28-6af02fe19b3f',
  'Colour+cut',
  4500,
  1,
  'Simren',
  NULL,
  '2026-06-16T10:00:00Z'
);

-- Billing #99: Swati
INSERT INTO billings (id, serial_number, customer_name, mobile_number, customer_gender, subtotal, discount, tax, grand_total, payment_method, notes, created_at, updated_at)
VALUES (
  'ea8b3dfc-25d0-4de2-b39e-b4081429266d',
  99,
  'Swati',
  '9978459719',
  NULL,
  190,
  0,
  0,
  190,
  'UPI',
  NULL,
  '2026-06-16T10:00:00Z',
  '2026-06-16T10:00:00Z'
);

INSERT INTO billing_services (id, billing_id, name, price, quantity, service_by, staff_assignments, created_at)
VALUES (
  '0c9a82a7-bc79-48c8-b3f8-39021e48a04f',
  'ea8b3dfc-25d0-4de2-b39e-b4081429266d',
  'threading+uprlips',
  190,
  1,
  'Shivani',
  NULL,
  '2026-06-16T10:00:00Z'
);

-- Billing #100: Sonal
INSERT INTO billings (id, serial_number, customer_name, mobile_number, customer_gender, subtotal, discount, tax, grand_total, payment_method, notes, created_at, updated_at)
VALUES (
  'b3860b72-e2ab-4097-a60e-2e9533024b30',
  100,
  'Sonal',
  '9099425225',
  NULL,
  700,
  0,
  0,
  700,
  'UPI',
  NULL,
  '2026-06-16T10:00:00Z',
  '2026-06-16T10:00:00Z'
);

INSERT INTO billing_services (id, billing_id, name, price, quantity, service_by, staff_assignments, created_at)
VALUES (
  '3040fa01-9a88-43cb-88d0-03f0d120196d',
  'b3860b72-e2ab-4097-a60e-2e9533024b30',
  'Hair colour',
  700,
  1,
  'Shivani',
  NULL,
  '2026-06-16T10:00:00Z'
);

-- Billing #101: Savita
INSERT INTO billings (id, serial_number, customer_name, mobile_number, customer_gender, subtotal, discount, tax, grand_total, payment_method, notes, created_at, updated_at)
VALUES (
  '4a104410-7253-4f8a-b682-3d5c7c25543d',
  101,
  'Savita',
  '7999553856',
  NULL,
  80,
  0,
  0,
  80,
  'Cash',
  NULL,
  '2026-06-16T10:00:00Z',
  '2026-06-16T10:00:00Z'
);

INSERT INTO billing_services (id, billing_id, name, price, quantity, service_by, staff_assignments, created_at)
VALUES (
  '62c339f8-5cb1-4d25-b369-2a281b138377',
  '4a104410-7253-4f8a-b682-3d5c7c25543d',
  'threading',
  80,
  1,
  'Shivani',
  NULL,
  '2026-06-16T10:00:00Z'
);

-- Billing #102: Sharad
INSERT INTO billings (id, serial_number, customer_name, mobile_number, customer_gender, subtotal, discount, tax, grand_total, payment_method, notes, created_at, updated_at)
VALUES (
  '3f9ab6ac-a144-4881-b5de-e100c2da2fa6',
  102,
  'Sharad',
  '9033732293',
  NULL,
  450,
  0,
  0,
  450,
  'Cash',
  NULL,
  '2026-06-16T10:00:00Z',
  '2026-06-16T10:00:00Z'
);

INSERT INTO billing_services (id, billing_id, name, price, quantity, service_by, staff_assignments, created_at)
VALUES (
  '5d2748db-edbb-45f4-b45b-569330d7c3a0',
  '3f9ab6ac-a144-4881-b5de-e100c2da2fa6',
  'Combo-1',
  450,
  1,
  'Sahil',
  NULL,
  '2026-06-16T10:00:00Z'
);

-- Billing #103: Madhu
INSERT INTO billings (id, serial_number, customer_name, mobile_number, customer_gender, subtotal, discount, tax, grand_total, payment_method, notes, created_at, updated_at)
VALUES (
  '710130d6-402f-4279-91b8-459fe3de71e6',
  103,
  'Madhu',
  '8160426937',
  NULL,
  50,
  0,
  0,
  50,
  'Cash',
  NULL,
  '2026-06-16T10:00:00Z',
  '2026-06-16T10:00:00Z'
);

INSERT INTO billing_services (id, billing_id, name, price, quantity, service_by, staff_assignments, created_at)
VALUES (
  '9d0e5baf-51b9-4e96-9058-8ba1fec02ddb',
  '710130d6-402f-4279-91b8-459fe3de71e6',
  'threading',
  50,
  1,
  'Shivani',
  NULL,
  '2026-06-16T10:00:00Z'
);

-- Billing #104: Dhara
INSERT INTO billings (id, serial_number, customer_name, mobile_number, customer_gender, subtotal, discount, tax, grand_total, payment_method, notes, created_at, updated_at)
VALUES (
  '169819ea-c11b-4c3c-9d89-72355e82f374',
  104,
  'Dhara',
  '9558034507',
  NULL,
  1400,
  0,
  0,
  1400,
  'UPI',
  NULL,
  '2026-06-16T10:00:00Z',
  '2026-06-16T10:00:00Z'
);

INSERT INTO billing_services (id, billing_id, name, price, quantity, service_by, staff_assignments, created_at)
VALUES (
  '608d3cb4-9375-4872-9b76-63b59fb34347',
  '169819ea-c11b-4c3c-9d89-72355e82f374',
  'Hair colour',
  1400,
  1,
  'Simren',
  NULL,
  '2026-06-16T10:00:00Z'
);

-- Billing #105: Lakshami
INSERT INTO billings (id, serial_number, customer_name, mobile_number, customer_gender, subtotal, discount, tax, grand_total, payment_method, notes, created_at, updated_at)
VALUES (
  'adee044a-fbb3-427d-9c70-d277522c07d6',
  105,
  'Lakshami',
  '9023732676',
  NULL,
  500,
  0,
  0,
  500,
  'UPI',
  NULL,
  '2026-06-16T10:00:00Z',
  '2026-06-16T10:00:00Z'
);

INSERT INTO billing_services (id, billing_id, name, price, quantity, service_by, staff_assignments, created_at)
VALUES (
  '9a386c8e-e6dc-4c0b-ae33-c5630a67cd3f',
  'adee044a-fbb3-427d-9c70-d277522c07d6',
  'hair cut',
  500,
  1,
  'Shivani, Simren',
  '[{"staffName":"Shivani","amount":100},{"staffName":"Simren","amount":400}]'::jsonb,
  '2026-06-16T10:00:00Z'
);

-- Billing #106: Nisarg
INSERT INTO billings (id, serial_number, customer_name, mobile_number, customer_gender, subtotal, discount, tax, grand_total, payment_method, notes, created_at, updated_at)
VALUES (
  '10d3f4cc-4556-41d7-ab65-f6b68d902efa',
  106,
  'Nisarg',
  '7778954065',
  NULL,
  300,
  0,
  0,
  300,
  'UPI',
  NULL,
  '2026-06-16T10:00:00Z',
  '2026-06-16T10:00:00Z'
);

INSERT INTO billing_services (id, billing_id, name, price, quantity, service_by, staff_assignments, created_at)
VALUES (
  '7a31db25-e8cd-4807-aae3-7f8fc46f78f3',
  '10d3f4cc-4556-41d7-ab65-f6b68d902efa',
  'cut+beard',
  300,
  1,
  'Sahil',
  NULL,
  '2026-06-16T10:00:00Z'
);

-- Billing #107: kartik
INSERT INTO billings (id, serial_number, customer_name, mobile_number, customer_gender, subtotal, discount, tax, grand_total, payment_method, notes, created_at, updated_at)
VALUES (
  '155ab4ef-2d5c-422b-b62b-81aceddec988',
  107,
  'kartik',
  '9033372065',
  NULL,
  450,
  0,
  0,
  450,
  'UPI',
  NULL,
  '2026-06-16T10:00:00Z',
  '2026-06-16T10:00:00Z'
);

INSERT INTO billing_services (id, billing_id, name, price, quantity, service_by, staff_assignments, created_at)
VALUES (
  '2d59ae5e-6fff-49cf-ac8b-1db7e741c2ad',
  '155ab4ef-2d5c-422b-b62b-81aceddec988',
  'Combo-1',
  450,
  1,
  'Sahil, Shivani',
  '[{"staffName":"Sahil","amount":350},{"staffName":"Shivani","amount":100}]'::jsonb,
  '2026-06-16T10:00:00Z'
);

-- Billing #108: Aanadha
INSERT INTO billings (id, serial_number, customer_name, mobile_number, customer_gender, subtotal, discount, tax, grand_total, payment_method, notes, created_at, updated_at)
VALUES (
  '4535c5dc-ecf7-4531-b953-f11fccc1f0d6',
  108,
  'Aanadha',
  '9426803154',
  NULL,
  200,
  0,
  0,
  200,
  'UPI',
  NULL,
  '2026-06-17T10:00:00Z',
  '2026-06-17T10:00:00Z'
);

INSERT INTO billing_services (id, billing_id, name, price, quantity, service_by, staff_assignments, created_at)
VALUES (
  '03a168e1-95e1-46a2-8750-c8ebc409553c',
  '4535c5dc-ecf7-4531-b953-f11fccc1f0d6',
  'hair cut',
  200,
  1,
  'Rahul',
  NULL,
  '2026-06-17T10:00:00Z'
);

-- Billing #109: Maya
INSERT INTO billings (id, serial_number, customer_name, mobile_number, customer_gender, subtotal, discount, tax, grand_total, payment_method, notes, created_at, updated_at)
VALUES (
  '6dd0c602-0c13-48e0-a7c8-ad8d7c131cdb',
  109,
  'Maya',
  '8469965543',
  NULL,
  300,
  0,
  0,
  300,
  'UPI',
  NULL,
  '2026-06-17T10:00:00Z',
  '2026-06-17T10:00:00Z'
);

INSERT INTO billing_services (id, billing_id, name, price, quantity, service_by, staff_assignments, created_at)
VALUES (
  '0d37574a-7e36-4f5a-8e96-0590a4ab2fc3',
  '6dd0c602-0c13-48e0-a7c8-ad8d7c131cdb',
  'cut+beard',
  300,
  1,
  'Imran',
  NULL,
  '2026-06-17T10:00:00Z'
);

-- Billing #110: Bhavana
INSERT INTO billings (id, serial_number, customer_name, mobile_number, customer_gender, subtotal, discount, tax, grand_total, payment_method, notes, created_at, updated_at)
VALUES (
  '2072de19-6297-401a-89f1-4bb88e65d5a4',
  110,
  'Bhavana',
  '7801950434',
  NULL,
  300,
  0,
  0,
  300,
  'Cash',
  NULL,
  '2026-06-17T10:00:00Z',
  '2026-06-17T10:00:00Z'
);

INSERT INTO billing_services (id, billing_id, name, price, quantity, service_by, staff_assignments, created_at)
VALUES (
  '9d564e6d-c20b-42ee-a928-a9c52df691e6',
  '2072de19-6297-401a-89f1-4bb88e65d5a4',
  'wash+blow dry',
  300,
  1,
  'Simren',
  NULL,
  '2026-06-17T10:00:00Z'
);

-- Billing #111: Kripal
INSERT INTO billings (id, serial_number, customer_name, mobile_number, customer_gender, subtotal, discount, tax, grand_total, payment_method, notes, created_at, updated_at)
VALUES (
  '1a813cf4-2122-454c-82d9-ee208ad38606',
  111,
  'Kripal',
  '9723018951',
  NULL,
  450,
  0,
  0,
  450,
  'UPI',
  NULL,
  '2026-06-17T10:00:00Z',
  '2026-06-17T10:00:00Z'
);

INSERT INTO billing_services (id, billing_id, name, price, quantity, service_by, staff_assignments, created_at)
VALUES (
  'f60bc014-d1aa-42f4-8b38-536f81aca7ad',
  '1a813cf4-2122-454c-82d9-ee208ad38606',
  'combo-1',
  450,
  1,
  'Imran',
  NULL,
  '2026-06-17T10:00:00Z'
);

-- Billing #112: Madhik
INSERT INTO billings (id, serial_number, customer_name, mobile_number, customer_gender, subtotal, discount, tax, grand_total, payment_method, notes, created_at, updated_at)
VALUES (
  '480342e3-8a09-4aa6-9577-4c02ac806465',
  112,
  'Madhik',
  '9274858489',
  NULL,
  300,
  0,
  0,
  300,
  'Cash',
  NULL,
  '2026-06-17T10:00:00Z',
  '2026-06-17T10:00:00Z'
);

INSERT INTO billing_services (id, billing_id, name, price, quantity, service_by, staff_assignments, created_at)
VALUES (
  'bad173ea-00ef-4e74-8faa-9380b91ce1e6',
  '480342e3-8a09-4aa6-9577-4c02ac806465',
  'cut+beard',
  300,
  1,
  'Imran',
  NULL,
  '2026-06-17T10:00:00Z'
);

-- Billing #113: Nitu
INSERT INTO billings (id, serial_number, customer_name, mobile_number, customer_gender, subtotal, discount, tax, grand_total, payment_method, notes, created_at, updated_at)
VALUES (
  'e2013832-2141-44f8-8a5b-5a3da93937dc',
  113,
  'Nitu',
  '9460470571',
  NULL,
  490,
  0,
  0,
  490,
  'UPI',
  NULL,
  '2026-06-17T10:00:00Z',
  '2026-06-17T10:00:00Z'
);

INSERT INTO billing_services (id, billing_id, name, price, quantity, service_by, staff_assignments, created_at)
VALUES (
  'b0227a55-a06b-402c-8747-754644273e2b',
  'e2013832-2141-44f8-8a5b-5a3da93937dc',
  'wax+cut',
  490,
  1,
  'Simren',
  NULL,
  '2026-06-17T10:00:00Z'
);

-- Billing #114: Vaivan
INSERT INTO billings (id, serial_number, customer_name, mobile_number, customer_gender, subtotal, discount, tax, grand_total, payment_method, notes, created_at, updated_at)
VALUES (
  'a75a024d-9ee1-49d3-88fc-ad1291cedf4a',
  114,
  'Vaivan',
  '9892318981',
  NULL,
  300,
  0,
  0,
  300,
  'UPI',
  NULL,
  '2026-06-17T10:00:00Z',
  '2026-06-17T10:00:00Z'
);

INSERT INTO billing_services (id, billing_id, name, price, quantity, service_by, staff_assignments, created_at)
VALUES (
  'bc0765cd-f758-46fa-81e5-1d63328fee73',
  'a75a024d-9ee1-49d3-88fc-ad1291cedf4a',
  'cut+beard',
  300,
  1,
  'Imran',
  NULL,
  '2026-06-17T10:00:00Z'
);

-- Billing #115: client
INSERT INTO billings (id, serial_number, customer_name, mobile_number, customer_gender, subtotal, discount, tax, grand_total, payment_method, notes, created_at, updated_at)
VALUES (
  'a1c373a6-d753-4b66-ada5-39981379b560',
  115,
  'client',
  '8141008236',
  NULL,
  300,
  0,
  0,
  300,
  'UPI',
  NULL,
  '2026-06-17T10:00:00Z',
  '2026-06-17T10:00:00Z'
);

INSERT INTO billing_services (id, billing_id, name, price, quantity, service_by, staff_assignments, created_at)
VALUES (
  'e5090310-6cb9-48b0-b950-f218da2b0db9',
  'a1c373a6-d753-4b66-ada5-39981379b560',
  'cut+beard',
  300,
  1,
  'Imran',
  NULL,
  '2026-06-17T10:00:00Z'
);

-- Billing #116: Sunil
INSERT INTO billings (id, serial_number, customer_name, mobile_number, customer_gender, subtotal, discount, tax, grand_total, payment_method, notes, created_at, updated_at)
VALUES (
  'ae194c79-9fd4-4b13-b65b-9429382d31f0',
  116,
  'Sunil',
  '8980493911',
  NULL,
  300,
  0,
  0,
  300,
  'UPI',
  NULL,
  '2026-06-18T10:00:00Z',
  '2026-06-18T10:00:00Z'
);

INSERT INTO billing_services (id, billing_id, name, price, quantity, service_by, staff_assignments, created_at)
VALUES (
  '7bbef173-d849-46a4-854e-337de55cbc2a',
  'ae194c79-9fd4-4b13-b65b-9429382d31f0',
  'cut+beard',
  300,
  1,
  'Shan',
  NULL,
  '2026-06-18T10:00:00Z'
);

-- Billing #117: Mayri
INSERT INTO billings (id, serial_number, customer_name, mobile_number, customer_gender, subtotal, discount, tax, grand_total, payment_method, notes, created_at, updated_at)
VALUES (
  '0ea0f6e6-8828-4268-96a3-3c0f9742f298',
  117,
  'Mayri',
  '8160197157',
  NULL,
  500,
  0,
  0,
  500,
  'Cash',
  NULL,
  '2026-06-18T10:00:00Z',
  '2026-06-18T10:00:00Z'
);

INSERT INTO billing_services (id, billing_id, name, price, quantity, service_by, staff_assignments, created_at)
VALUES (
  '660d3926-f67c-4b4c-b5f6-ea8508328c0f',
  '0ea0f6e6-8828-4268-96a3-3c0f9742f298',
  'cut+wash',
  500,
  1,
  'Simren',
  NULL,
  '2026-06-18T10:00:00Z'
);

-- Billing #118: Swati
INSERT INTO billings (id, serial_number, customer_name, mobile_number, customer_gender, subtotal, discount, tax, grand_total, payment_method, notes, created_at, updated_at)
VALUES (
  'ab3c7cbf-41b2-445f-8c07-2ca1d2de6cbe',
  118,
  'Swati',
  '9784559719',
  NULL,
  1000,
  0,
  0,
  1000,
  'UPI',
  NULL,
  '2026-06-18T10:00:00Z',
  '2026-06-18T10:00:00Z'
);

INSERT INTO billing_services (id, billing_id, name, price, quantity, service_by, staff_assignments, created_at)
VALUES (
  '0325e1c7-ae1d-4ce5-ad88-6a987ad63574',
  'ab3c7cbf-41b2-445f-8c07-2ca1d2de6cbe',
  'mehndi',
  1000,
  1,
  'Shivani',
  NULL,
  '2026-06-18T10:00:00Z'
);

-- Billing #119: Dhara
INSERT INTO billings (id, serial_number, customer_name, mobile_number, customer_gender, subtotal, discount, tax, grand_total, payment_method, notes, created_at, updated_at)
VALUES (
  '12158cc7-bcd5-4cfd-a060-68dbda2a1423',
  119,
  'Dhara',
  '9313709376',
  NULL,
  490,
  0,
  0,
  490,
  'UPI',
  NULL,
  '2026-06-18T10:00:00Z',
  '2026-06-18T10:00:00Z'
);

INSERT INTO billing_services (id, billing_id, name, price, quantity, service_by, staff_assignments, created_at)
VALUES (
  'e84fbdd4-69b9-457c-912a-2b65603f60f1',
  '12158cc7-bcd5-4cfd-a060-68dbda2a1423',
  'cut+threading',
  490,
  1,
  'Simren190+sahil300',
  NULL,
  '2026-06-18T10:00:00Z'
);

-- Billing #120: Raj
INSERT INTO billings (id, serial_number, customer_name, mobile_number, customer_gender, subtotal, discount, tax, grand_total, payment_method, notes, created_at, updated_at)
VALUES (
  '37468f8d-c553-49d6-bef1-b1a7ae882b54',
  120,
  'Raj',
  '9898222773',
  NULL,
  300,
  0,
  0,
  300,
  'UPI',
  NULL,
  '2026-06-18T10:00:00Z',
  '2026-06-18T10:00:00Z'
);

INSERT INTO billing_services (id, billing_id, name, price, quantity, service_by, staff_assignments, created_at)
VALUES (
  '3765f96e-3ebd-4bd6-bbee-40f3b2ec7d84',
  '37468f8d-c553-49d6-bef1-b1a7ae882b54',
  'cut+beard',
  300,
  1,
  'Shan',
  NULL,
  '2026-06-18T10:00:00Z'
);

