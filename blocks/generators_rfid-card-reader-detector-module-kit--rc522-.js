Blockly.JavaScript['rfid_card_module_setup'] = function(block) {
  var text_rfid_card_module_setup_sda_pin = block.getFieldValue('RFID_CARD_MODULE_SETUP_SDA_PIN');
  var text_rfid_card_module_setup_scl_pin = block.getFieldValue('RFID_CARD_MODULE_SETUP_SCL_PIN');
  // TODO: Assemble JavaScript into code variable.
  var code = `
	#EXTINC
		#include <SPI.h>
		#include <MFRC522.h>

		#define RFID_SS_PIN ${text_rfid_card_module_setup_sda_pin}
		#define RFID_RST_PIN ${text_rfid_card_module_setup_scl_pin}
		 
		MFRC522 rfid(RFID_SS_PIN, RFID_RST_PIN); // Instance of the class

		MFRC522::MIFARE_Key key; 
	#END

	#SETUP
	  SPI.begin(); // Init SPI bus
	  rfid.PCD_Init(); // Init MFRC522 

	  for (byte i = 0; i < 6; i++) {
	    key.keyByte[i] = 0xFF;
	  }

	  Serial.println(F("This code scan the MIFARE Classsic NUID."));
	  Serial.print(F("Using the following key:"));
	  printHex(key.keyByte, MFRC522::MF_KEY_SIZE);
	#END
  `;
  return code;
};

Blockly.JavaScript['rfid_card_module_read_nuid'] = function(block) {
  var dropdown_read_nuid_tag = block.getFieldValue('READ_NUID_TAG');
  var variable_nuid_tag_value = Blockly.JavaScript.variableDB_.getName(block.getFieldValue('NUID_TAG_VALUE'), Blockly.Variables.NAME_TYPE);
  // TODO: Assemble JavaScript into code variable.
  var code = `
	#VARIABLE
		// Init array that will store new NUID 
		byte nuidPICC[4];
	#END

	#FUNCTION
		/**
		 * Helper routine to dump a byte array as hex values to Serial. 
		 */
		void printHex(byte *buffer, byte bufferSize) {
			${variable_nuid_tag_value} = "";
		  for (byte i = 0; i < bufferSize; i++) {
		     if (buffer[i] >= 0x10) {
		      ${variable_nuid_tag_value} += " ";  
		     }
		     ${variable_nuid_tag_value} += String(buffer[i], HEX);
		  }
		  ${variable_nuid_tag_value}.toUpperCase();
		}

		/**
		 * Helper routine to dump a byte array as dec values to Serial.
		 */
		void printDec(byte *buffer, byte bufferSize) {
		  ${variable_nuid_tag_value} = "";
		  for (byte i = 0; i < bufferSize; i++) {
		     if (buffer[i] >= 0x10) {
		      ${variable_nuid_tag_value} += " ";  
		     }
		     ${variable_nuid_tag_value} += String(buffer[i], DEC);
		  }
		  ${variable_nuid_tag_value}.toUpperCase();
		}
	#END

	// Reset the loop if no new card present on the sensor/reader. This saves the entire process when idle.
	  if ( ! rfid.PICC_IsNewCardPresent())
	    return;

	  // Verify if the NUID has been readed
	  if ( ! rfid.PICC_ReadCardSerial())
	    return;

	  // Serial.print(F("PICC type: "));
	  MFRC522::PICC_Type piccType = rfid.PICC_GetType(rfid.uid.sak);
	  // Serial.println(rfid.PICC_GetTypeName(piccType));

	  // Check is the PICC of Classic MIFARE type
	  if (piccType != MFRC522::PICC_TYPE_MIFARE_MINI &&  
	    piccType != MFRC522::PICC_TYPE_MIFARE_1K &&
	    piccType != MFRC522::PICC_TYPE_MIFARE_4K) {
	    // Serial.println(F("Your tag is not of type MIFARE Classic."));
	    return;
	  }

	  // if (rfid.uid.uidByte[0] != nuidPICC[0] || 
	    // rfid.uid.uidByte[1] != nuidPICC[1] || 
	    // rfid.uid.uidByte[2] != nuidPICC[2] || 
	    // rfid.uid.uidByte[3] != nuidPICC[3] ) {
	    // Serial.println(F("A new card has been detected."));

	    // Store NUID into nuidPICC array
	    for (byte i = 0; i < 4; i++) {
	      nuidPICC[i] = rfid.uid.uidByte[i];
	    }
	   
		${dropdown_read_nuid_tag == 'READ_NUID_HEX' ? 'printHex(rfid.uid.uidByte, rfid.uid.size);' : 'printDec(rfid.uid.uidByte, rfid.uid.size);'}

	    // Serial.println(F("The NUID tag is:"));
	    // Serial.print(F("In hex: "));
	    // printHex(rfid.uid.uidByte, rfid.uid.size);
	    // Serial.println();
	    // Serial.print(F("In dec: "));
	    // printDec(rfid.uid.uidByte, rfid.uid.size);
	    // Serial.println();
	  // }
	  // else Serial.println(F("Card read previously."));

	  // Halt PICC
	  rfid.PICC_HaltA();

	  // Stop encryption on PCD
	  rfid.PCD_StopCrypto1();
  `;
  return code;
};