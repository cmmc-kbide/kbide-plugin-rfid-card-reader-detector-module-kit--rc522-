Blockly.Blocks['rfid_card_module_setup'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("SETUP / RFID CARD MODULE");
    this.appendDummyInput()
        .appendField("SDA PIN")
        .appendField(new Blockly.FieldTextInput("21"), "RFID_CARD_MODULE_SETUP_SDA_PIN")
        .appendField("SCL PIN")
        .appendField(new Blockly.FieldTextInput("22"), "RFID_CARD_MODULE_SETUP_SCL_PIN");
    this.appendDummyInput();
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(230);
 this.setTooltip("");
 this.setHelpUrl("");
  }
};

Blockly.Blocks['rfid_card_module_read_nuid'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("READ NUID TAG")
        .appendField(new Blockly.FieldDropdown([["HEX","READ_NUID_HEX"], ["DEC","READ_NUID_DEC"]]), "READ_NUID_TAG")
        .appendField("SET TO")
        .appendField(new Blockly.FieldVariable("NUID_TAG_VALUE"), "NUID_TAG_VALUE");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(230);
 this.setTooltip("");
 this.setHelpUrl("");
  }
};