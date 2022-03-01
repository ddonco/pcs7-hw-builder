import { Channel } from "./hw_module";

export function buildAIDiagnostics(channels: Channel[]): string {
  const staticBeginString = `PARAMETER 
  VERSION_HIGH, "0"
  VERSION_LOW, "0"
  CONSTANT, "1"
  NUMBER_OF_FOLLOWING_PARAMETER_STRUCTURES, "2"
  NUMBER_OF_FOLLOWING_MODULE_PARAMETER_BLOCKS, "1"
  LENGTH_OF_A_FOLLOWING_MODULE_PARAMETER_BLOCK, "6"
  REDUNDANCY_SETTINGS, "0"
  MY_LADDR_HIGH, "0"
  MY_LADDR_LOW, "0"
  RED_LADDR_HIGH, "0"
  RED_LADDR_LOW, "0"
  NUMBER_OF_FOLLOWING_CHANNEL_PARAMETER_BLOCKS, "16"
  LENGTH_OF_A_FOLLOWING_CHANNEL_PARAMETER_BLOCK, "14"
  DIAGNOSTICS_MISSING_SUPPLY_VOLTAGE_L, "1"\n`;
  const staticEndString = `  MEASURING_RANGE, AI , 0, "4_TO_20_MA_HART"
  MEASURING_RANGE, AI , 1, "4_TO_20_MA_HART"
  MEASURING_RANGE, AI , 2, "4_TO_20_MA_HART"
  MEASURING_RANGE, AI , 3, "4_TO_20_MA_HART"
  MEASURING_RANGE, AI , 4, "4_TO_20_MA_HART"
  MEASURING_RANGE, AI , 5, "4_TO_20_MA_HART"
  MEASURING_RANGE, AI , 6, "4_TO_20_MA_HART"
  MEASURING_RANGE, AI , 7, "4_TO_20_MA_HART"
  MEASURING_RANGE, AI , 8, "4_TO_20_MA_HART"
  MEASURING_RANGE, AI , 9, "4_TO_20_MA_HART"
  MEASURING_RANGE, AI , 10, "4_TO_20_MA_HART"
  MEASURING_RANGE, AI , 11, "4_TO_20_MA_HART"
  MEASURING_RANGE, AI , 12, "4_TO_20_MA_HART"
  MEASURING_RANGE, AI , 13, "4_TO_20_MA_HART"
  MEASURING_RANGE, AI , 14, "4_TO_20_MA_HART"
  MEASURING_RANGE, AI , 15, "4_TO_20_MA_HART"
  DIAGNOSTICS_TRANSDUCER_SUPPLY, AI , 0, "1"
  DIAGNOSTICS_TRANSDUCER_SUPPLY, AI , 1, "1"
  DIAGNOSTICS_TRANSDUCER_SUPPLY, AI , 2, "1"
  DIAGNOSTICS_TRANSDUCER_SUPPLY, AI , 3, "1"
  DIAGNOSTICS_TRANSDUCER_SUPPLY, AI , 4, "1"
  DIAGNOSTICS_TRANSDUCER_SUPPLY, AI , 5, "1"
  DIAGNOSTICS_TRANSDUCER_SUPPLY, AI , 6, "1"
  DIAGNOSTICS_TRANSDUCER_SUPPLY, AI , 7, "1"
  DIAGNOSTICS_TRANSDUCER_SUPPLY, AI , 8, "1"
  DIAGNOSTICS_TRANSDUCER_SUPPLY, AI , 9, "1"
  DIAGNOSTICS_TRANSDUCER_SUPPLY, AI , 10, "1"
  DIAGNOSTICS_TRANSDUCER_SUPPLY, AI , 11, "1"
  DIAGNOSTICS_TRANSDUCER_SUPPLY, AI , 12, "1"
  DIAGNOSTICS_TRANSDUCER_SUPPLY, AI , 13, "1"
  DIAGNOSTICS_TRANSDUCER_SUPPLY, AI , 14, "1"
  DIAGNOSTICS_TRANSDUCER_SUPPLY, AI , 15, "1"
  DIAGNOSTICS_SHORT_CIRCUIT_TO_L, AI , 0, "1"
  DIAGNOSTICS_SHORT_CIRCUIT_TO_L, AI , 1, "1"
  DIAGNOSTICS_SHORT_CIRCUIT_TO_L, AI , 2, "1"
  DIAGNOSTICS_SHORT_CIRCUIT_TO_L, AI , 3, "1"
  DIAGNOSTICS_SHORT_CIRCUIT_TO_L, AI , 4, "1"
  DIAGNOSTICS_SHORT_CIRCUIT_TO_L, AI , 5, "1"
  DIAGNOSTICS_SHORT_CIRCUIT_TO_L, AI , 6, "1"
  DIAGNOSTICS_SHORT_CIRCUIT_TO_L, AI , 7, "1"
  DIAGNOSTICS_SHORT_CIRCUIT_TO_L, AI , 8, "1"
  DIAGNOSTICS_SHORT_CIRCUIT_TO_L, AI , 9, "1"
  DIAGNOSTICS_SHORT_CIRCUIT_TO_L, AI , 10, "1"
  DIAGNOSTICS_SHORT_CIRCUIT_TO_L, AI , 11, "1"
  DIAGNOSTICS_SHORT_CIRCUIT_TO_L, AI , 12, "1"
  DIAGNOSTICS_SHORT_CIRCUIT_TO_L, AI , 13, "1"
  DIAGNOSTICS_SHORT_CIRCUIT_TO_L, AI , 14, "1"
  DIAGNOSTICS_SHORT_CIRCUIT_TO_L, AI , 15, "1"
  DIAGNOSTICS_WIRE_BREAK, AI , 0, "1"
  DIAGNOSTICS_WIRE_BREAK, AI , 1, "1"
  DIAGNOSTICS_WIRE_BREAK, AI , 2, "1"
  DIAGNOSTICS_WIRE_BREAK, AI , 3, "1"
  DIAGNOSTICS_WIRE_BREAK, AI , 4, "1"
  DIAGNOSTICS_WIRE_BREAK, AI , 5, "1"
  DIAGNOSTICS_WIRE_BREAK, AI , 6, "1"
  DIAGNOSTICS_WIRE_BREAK, AI , 7, "1"
  DIAGNOSTICS_WIRE_BREAK, AI , 8, "1"
  DIAGNOSTICS_WIRE_BREAK, AI , 9, "1"
  DIAGNOSTICS_WIRE_BREAK, AI , 10, "1"
  DIAGNOSTICS_WIRE_BREAK, AI , 11, "1"
  DIAGNOSTICS_WIRE_BREAK, AI , 12, "1"
  DIAGNOSTICS_WIRE_BREAK, AI , 13, "1"
  DIAGNOSTICS_WIRE_BREAK, AI , 14, "1"
  DIAGNOSTICS_WIRE_BREAK, AI , 15, "1"
  DIAGNOSTICS_UNDERFLOW, AI , 0, "1"
  DIAGNOSTICS_UNDERFLOW, AI , 1, "1"
  DIAGNOSTICS_UNDERFLOW, AI , 2, "1"
  DIAGNOSTICS_UNDERFLOW, AI , 3, "1"
  DIAGNOSTICS_UNDERFLOW, AI , 4, "1"
  DIAGNOSTICS_UNDERFLOW, AI , 5, "1"
  DIAGNOSTICS_UNDERFLOW, AI , 6, "1"
  DIAGNOSTICS_UNDERFLOW, AI , 7, "1"
  DIAGNOSTICS_UNDERFLOW, AI , 8, "1"
  DIAGNOSTICS_UNDERFLOW, AI , 9, "1"
  DIAGNOSTICS_UNDERFLOW, AI , 10, "1"
  DIAGNOSTICS_UNDERFLOW, AI , 11, "1"
  DIAGNOSTICS_UNDERFLOW, AI , 12, "1"
  DIAGNOSTICS_UNDERFLOW, AI , 13, "1"
  DIAGNOSTICS_UNDERFLOW, AI , 14, "1"
  DIAGNOSTICS_UNDERFLOW, AI , 15, "1"
  DIAGNOSTICS_OVERFLOW, AI , 0, "1"
  DIAGNOSTICS_OVERFLOW, AI , 1, "1"
  DIAGNOSTICS_OVERFLOW, AI , 2, "1"
  DIAGNOSTICS_OVERFLOW, AI , 3, "1"
  DIAGNOSTICS_OVERFLOW, AI , 4, "1"
  DIAGNOSTICS_OVERFLOW, AI , 5, "1"
  DIAGNOSTICS_OVERFLOW, AI , 6, "1"
  DIAGNOSTICS_OVERFLOW, AI , 7, "1"
  DIAGNOSTICS_OVERFLOW, AI , 8, "1"
  DIAGNOSTICS_OVERFLOW, AI , 9, "1"
  DIAGNOSTICS_OVERFLOW, AI , 10, "1"
  DIAGNOSTICS_OVERFLOW, AI , 11, "1"
  DIAGNOSTICS_OVERFLOW, AI , 12, "1"
  DIAGNOSTICS_OVERFLOW, AI , 13, "1"
  DIAGNOSTICS_OVERFLOW, AI , 14, "1"
  DIAGNOSTICS_OVERFLOW, AI , 15, "1"
  SMOOTHING, AI , 0, "NONE"
  SMOOTHING, AI , 1, "NONE"
  SMOOTHING, AI , 2, "NONE"
  SMOOTHING, AI , 3, "NONE"
  SMOOTHING, AI , 4, "NONE"
  SMOOTHING, AI , 5, "NONE"
  SMOOTHING, AI , 6, "NONE"
  SMOOTHING, AI , 7, "NONE"
  SMOOTHING, AI , 8, "NONE"
  SMOOTHING, AI , 9, "NONE"
  SMOOTHING, AI , 10, "NONE"
  SMOOTHING, AI , 11, "NONE"
  SMOOTHING, AI , 12, "NONE"
  SMOOTHING, AI , 13, "NONE"
  SMOOTHING, AI , 14, "NONE"
  SMOOTHING, AI , 15, "NONE"
  INTERFERENCE_FREQUENCY_SUPPRESSION, AI , 0, "10_HZ"
  INTERFERENCE_FREQUENCY_SUPPRESSION, AI , 1, "10_HZ"
  INTERFERENCE_FREQUENCY_SUPPRESSION, AI , 2, "10_HZ"
  INTERFERENCE_FREQUENCY_SUPPRESSION, AI , 3, "10_HZ"
  INTERFERENCE_FREQUENCY_SUPPRESSION, AI , 4, "10_HZ"
  INTERFERENCE_FREQUENCY_SUPPRESSION, AI , 5, "10_HZ"
  INTERFERENCE_FREQUENCY_SUPPRESSION, AI , 6, "10_HZ"
  INTERFERENCE_FREQUENCY_SUPPRESSION, AI , 7, "10_HZ"
  INTERFERENCE_FREQUENCY_SUPPRESSION, AI , 8, "10_HZ"
  INTERFERENCE_FREQUENCY_SUPPRESSION, AI , 9, "10_HZ"
  INTERFERENCE_FREQUENCY_SUPPRESSION, AI , 10, "10_HZ"
  INTERFERENCE_FREQUENCY_SUPPRESSION, AI , 11, "10_HZ"
  INTERFERENCE_FREQUENCY_SUPPRESSION, AI , 12, "10_HZ"
  INTERFERENCE_FREQUENCY_SUPPRESSION, AI , 13, "10_HZ"
  INTERFERENCE_FREQUENCY_SUPPRESSION, AI , 14, "10_HZ"
  INTERFERENCE_FREQUENCY_SUPPRESSION, AI , 15, "10_HZ"
  DIAGNOSTICS_HART, AI , 0, "1"
  DIAGNOSTICS_HART, AI , 1, "1"
  DIAGNOSTICS_HART, AI , 2, "1"
  DIAGNOSTICS_HART, AI , 3, "1"
  DIAGNOSTICS_HART, AI , 4, "1"
  DIAGNOSTICS_HART, AI , 5, "1"
  DIAGNOSTICS_HART, AI , 6, "1"
  DIAGNOSTICS_HART, AI , 7, "1"
  DIAGNOSTICS_HART, AI , 8, "1"
  DIAGNOSTICS_HART, AI , 9, "1"
  DIAGNOSTICS_HART, AI , 10, "1"
  DIAGNOSTICS_HART, AI , 11, "1"
  DIAGNOSTICS_HART, AI , 12, "1"
  DIAGNOSTICS_HART, AI , 13, "1"
  DIAGNOSTICS_HART, AI , 14, "1"
  DIAGNOSTICS_HART, AI , 15, "1"
  FAILURE_MONITORING, AI , 0, "DEACTIVATED"
  FAILURE_MONITORING, AI , 1, "DEACTIVATED"
  FAILURE_MONITORING, AI , 2, "DEACTIVATED"
  FAILURE_MONITORING, AI , 3, "DEACTIVATED"
  FAILURE_MONITORING, AI , 4, "DEACTIVATED"
  FAILURE_MONITORING, AI , 5, "DEACTIVATED"
  FAILURE_MONITORING, AI , 6, "DEACTIVATED"
  FAILURE_MONITORING, AI , 7, "DEACTIVATED"
  FAILURE_MONITORING, AI , 8, "DEACTIVATED"
  FAILURE_MONITORING, AI , 9, "DEACTIVATED"
  FAILURE_MONITORING, AI , 10, "DEACTIVATED"
  FAILURE_MONITORING, AI , 11, "DEACTIVATED"
  FAILURE_MONITORING, AI , 12, "DEACTIVATED"
  FAILURE_MONITORING, AI , 13, "DEACTIVATED"
  FAILURE_MONITORING, AI , 14, "DEACTIVATED"
  FAILURE_MONITORING, AI , 15, "DEACTIVATED"
  COUNT_OF_HART_RETRIES, AI , 0, "5"
  COUNT_OF_HART_RETRIES, AI , 1, "5"
  COUNT_OF_HART_RETRIES, AI , 2, "5"
  COUNT_OF_HART_RETRIES, AI , 3, "5"
  COUNT_OF_HART_RETRIES, AI , 4, "5"
  COUNT_OF_HART_RETRIES, AI , 5, "5"
  COUNT_OF_HART_RETRIES, AI , 6, "5"
  COUNT_OF_HART_RETRIES, AI , 7, "5"
  COUNT_OF_HART_RETRIES, AI , 8, "5"
  COUNT_OF_HART_RETRIES, AI , 9, "5"
  COUNT_OF_HART_RETRIES, AI , 10, "5"
  COUNT_OF_HART_RETRIES, AI , 11, "5"
  COUNT_OF_HART_RETRIES, AI , 12, "5"
  COUNT_OF_HART_RETRIES, AI , 13, "5"
  COUNT_OF_HART_RETRIES, AI , 14, "5"
  COUNT_OF_HART_RETRIES, AI , 15, "5"
  HARDWARE_INTERRUPT_HIGH_LIMIT_1, AI , 0, "0"
  HARDWARE_INTERRUPT_HIGH_LIMIT_1, AI , 1, "0"
  HARDWARE_INTERRUPT_HIGH_LIMIT_1, AI , 2, "0"
  HARDWARE_INTERRUPT_HIGH_LIMIT_1, AI , 3, "0"
  HARDWARE_INTERRUPT_HIGH_LIMIT_1, AI , 4, "0"
  HARDWARE_INTERRUPT_HIGH_LIMIT_1, AI , 5, "0"
  HARDWARE_INTERRUPT_HIGH_LIMIT_1, AI , 6, "0"
  HARDWARE_INTERRUPT_HIGH_LIMIT_1, AI , 7, "0"
  HARDWARE_INTERRUPT_HIGH_LIMIT_1, AI , 8, "0"
  HARDWARE_INTERRUPT_HIGH_LIMIT_1, AI , 9, "0"
  HARDWARE_INTERRUPT_HIGH_LIMIT_1, AI , 10, "0"
  HARDWARE_INTERRUPT_HIGH_LIMIT_1, AI , 11, "0"
  HARDWARE_INTERRUPT_HIGH_LIMIT_1, AI , 12, "0"
  HARDWARE_INTERRUPT_HIGH_LIMIT_1, AI , 13, "0"
  HARDWARE_INTERRUPT_HIGH_LIMIT_1, AI , 14, "0"
  HARDWARE_INTERRUPT_HIGH_LIMIT_1, AI , 15, "0"
  HARDWARE_INTERRUPT_LOW_LIMIT_1, AI , 0, "0"
  HARDWARE_INTERRUPT_LOW_LIMIT_1, AI , 1, "0"
  HARDWARE_INTERRUPT_LOW_LIMIT_1, AI , 2, "0"
  HARDWARE_INTERRUPT_LOW_LIMIT_1, AI , 3, "0"
  HARDWARE_INTERRUPT_LOW_LIMIT_1, AI , 4, "0"
  HARDWARE_INTERRUPT_LOW_LIMIT_1, AI , 5, "0"
  HARDWARE_INTERRUPT_LOW_LIMIT_1, AI , 6, "0"
  HARDWARE_INTERRUPT_LOW_LIMIT_1, AI , 7, "0"
  HARDWARE_INTERRUPT_LOW_LIMIT_1, AI , 8, "0"
  HARDWARE_INTERRUPT_LOW_LIMIT_1, AI , 9, "0"
  HARDWARE_INTERRUPT_LOW_LIMIT_1, AI , 10, "0"
  HARDWARE_INTERRUPT_LOW_LIMIT_1, AI , 11, "0"
  HARDWARE_INTERRUPT_LOW_LIMIT_1, AI , 12, "0"
  HARDWARE_INTERRUPT_LOW_LIMIT_1, AI , 13, "0"
  HARDWARE_INTERRUPT_LOW_LIMIT_1, AI , 14, "0"
  HARDWARE_INTERRUPT_LOW_LIMIT_1, AI , 15, "0"
  HARDWARE_INTERRUPT_HIGH_LIMIT_2, AI , 0, "0"
  HARDWARE_INTERRUPT_HIGH_LIMIT_2, AI , 1, "0"
  HARDWARE_INTERRUPT_HIGH_LIMIT_2, AI , 2, "0"
  HARDWARE_INTERRUPT_HIGH_LIMIT_2, AI , 3, "0"
  HARDWARE_INTERRUPT_HIGH_LIMIT_2, AI , 4, "0"
  HARDWARE_INTERRUPT_HIGH_LIMIT_2, AI , 5, "0"
  HARDWARE_INTERRUPT_HIGH_LIMIT_2, AI , 6, "0"
  HARDWARE_INTERRUPT_HIGH_LIMIT_2, AI , 7, "0"
  HARDWARE_INTERRUPT_HIGH_LIMIT_2, AI , 8, "0"
  HARDWARE_INTERRUPT_HIGH_LIMIT_2, AI , 9, "0"
  HARDWARE_INTERRUPT_HIGH_LIMIT_2, AI , 10, "0"
  HARDWARE_INTERRUPT_HIGH_LIMIT_2, AI , 11, "0"
  HARDWARE_INTERRUPT_HIGH_LIMIT_2, AI , 12, "0"
  HARDWARE_INTERRUPT_HIGH_LIMIT_2, AI , 13, "0"
  HARDWARE_INTERRUPT_HIGH_LIMIT_2, AI , 14, "0"
  HARDWARE_INTERRUPT_HIGH_LIMIT_2, AI , 15, "0"
  HARDWARE_INTERRUPT_LOW_LIMIT_2, AI , 0, "0"
  HARDWARE_INTERRUPT_LOW_LIMIT_2, AI , 1, "0"
  HARDWARE_INTERRUPT_LOW_LIMIT_2, AI , 2, "0"
  HARDWARE_INTERRUPT_LOW_LIMIT_2, AI , 3, "0"
  HARDWARE_INTERRUPT_LOW_LIMIT_2, AI , 4, "0"
  HARDWARE_INTERRUPT_LOW_LIMIT_2, AI , 5, "0"
  HARDWARE_INTERRUPT_LOW_LIMIT_2, AI , 6, "0"
  HARDWARE_INTERRUPT_LOW_LIMIT_2, AI , 7, "0"
  HARDWARE_INTERRUPT_LOW_LIMIT_2, AI , 8, "0"
  HARDWARE_INTERRUPT_LOW_LIMIT_2, AI , 9, "0"
  HARDWARE_INTERRUPT_LOW_LIMIT_2, AI , 10, "0"
  HARDWARE_INTERRUPT_LOW_LIMIT_2, AI , 11, "0"
  HARDWARE_INTERRUPT_LOW_LIMIT_2, AI , 12, "0"
  HARDWARE_INTERRUPT_LOW_LIMIT_2, AI , 13, "0"
  HARDWARE_INTERRUPT_LOW_LIMIT_2, AI , 14, "0"
  HARDWARE_INTERRUPT_LOW_LIMIT_2, AI , 15, "0"
  HIGH_LIMIT_1, AI , 0, "0"
  HIGH_LIMIT_1, AI , 1, "0"
  HIGH_LIMIT_1, AI , 2, "0"
  HIGH_LIMIT_1, AI , 3, "0"
  HIGH_LIMIT_1, AI , 4, "0"
  HIGH_LIMIT_1, AI , 5, "0"
  HIGH_LIMIT_1, AI , 6, "0"
  HIGH_LIMIT_1, AI , 7, "0"
  HIGH_LIMIT_1, AI , 8, "0"
  HIGH_LIMIT_1, AI , 9, "0"
  HIGH_LIMIT_1, AI , 10, "0"
  HIGH_LIMIT_1, AI , 11, "0"
  HIGH_LIMIT_1, AI , 12, "0"
  HIGH_LIMIT_1, AI , 13, "0"
  HIGH_LIMIT_1, AI , 14, "0"
  HIGH_LIMIT_1, AI , 15, "0"
  LOW_LIMIT_1, AI , 0, "0"
  LOW_LIMIT_1, AI , 1, "0"
  LOW_LIMIT_1, AI , 2, "0"
  LOW_LIMIT_1, AI , 3, "0"
  LOW_LIMIT_1, AI , 4, "0"
  LOW_LIMIT_1, AI , 5, "0"
  LOW_LIMIT_1, AI , 6, "0"
  LOW_LIMIT_1, AI , 7, "0"
  LOW_LIMIT_1, AI , 8, "0"
  LOW_LIMIT_1, AI , 9, "0"
  LOW_LIMIT_1, AI , 10, "0"
  LOW_LIMIT_1, AI , 11, "0"
  LOW_LIMIT_1, AI , 12, "0"
  LOW_LIMIT_1, AI , 13, "0"
  LOW_LIMIT_1, AI , 14, "0"
  LOW_LIMIT_1, AI , 15, "0"
  HIGH_LIMIT_2, AI , 0, "0"
  HIGH_LIMIT_2, AI , 1, "0"
  HIGH_LIMIT_2, AI , 2, "0"
  HIGH_LIMIT_2, AI , 3, "0"
  HIGH_LIMIT_2, AI , 4, "0"
  HIGH_LIMIT_2, AI , 5, "0"
  HIGH_LIMIT_2, AI , 6, "0"
  HIGH_LIMIT_2, AI , 7, "0"
  HIGH_LIMIT_2, AI , 8, "0"
  HIGH_LIMIT_2, AI , 9, "0"
  HIGH_LIMIT_2, AI , 10, "0"
  HIGH_LIMIT_2, AI , 11, "0"
  HIGH_LIMIT_2, AI , 12, "0"
  HIGH_LIMIT_2, AI , 13, "0"
  HIGH_LIMIT_2, AI , 14, "0"
  HIGH_LIMIT_2, AI , 15, "0"
  LOW_LIMIT_2, AI , 0, "0"
  LOW_LIMIT_2, AI , 1, "0"
  LOW_LIMIT_2, AI , 2, "0"
  LOW_LIMIT_2, AI , 3, "0"
  LOW_LIMIT_2, AI , 4, "0"
  LOW_LIMIT_2, AI , 5, "0"
  LOW_LIMIT_2, AI , 6, "0"
  LOW_LIMIT_2, AI , 7, "0"
  LOW_LIMIT_2, AI , 8, "0"
  LOW_LIMIT_2, AI , 9, "0"
  LOW_LIMIT_2, AI , 10, "0"
  LOW_LIMIT_2, AI , 11, "0"
  LOW_LIMIT_2, AI , 12, "0"
  LOW_LIMIT_2, AI , 13, "0"
  LOW_LIMIT_2, AI , 14, "0"
  LOW_LIMIT_2, AI , 15, "0"
  HART_VAR_CHANNEL_1, "0"
  HART_VARIABLE_1, "0"
  HART_VAR_CHANNEL_2, "0"
  HART_VARIABLE_2, "0"
  HART_VAR_CHANNEL_3, "0"
  HART_VARIABLE_3, "0"
  HART_VAR_CHANNEL_4, "0"
  HART_VARIABLE_4, "0"
  HART_VAR_CHANNEL_5, "0"
  HART_VARIABLE_5, "0"
  HART_VAR_CHANNEL_6, "0"
  HART_VARIABLE_6, "0"
  HART_VAR_CHANNEL_7, "0"
  HART_VARIABLE_7, "0"
  HART_VAR_CHANNEL_8, "0"
  HART_VARIABLE_8, "0"\n`;

  let dynamicString = "";
  channels.forEach((channel, index) => {
    dynamicString += `  MEASURING_TYPE, AI , ${index}, "${
      channel.spare ? "DEACTIVATED" : "CURRENT_(2-WIRE_TRANSDUCER)"
    }"\n`;
  });

  return staticBeginString + dynamicString + staticEndString;
}

export function buildAODiagnostics(channels: Channel[]): string {
  const staticBeginString = `PARAMETER 
  VERSION_HIGH, "0"
  VERSION_LOW, "0"
  NUMBER_OF_FOLLOWING_PARAMETER_STRUCTURES, "2"
  NUMBER_OF_FOLLOWING_MODULE_PARAMETER_BLOCKS, "1"
  LENGTH_OF_A_FOLLOWING_MODULE_PARAMETER_BLOCK, "6"
  REDUNDANCY_SETTINGS, "0"
  MY_LADDR_HIGH, "0"
  MY_LADDR_LOW, "0"
  RED_LADDR_HIGH, "0"
  RED_LADDR_LOW, "0"
  NUMBER_OF_FOLLOWING_CHANNEL_PARAMETER_BLOCKS, "8"
  LENGTH_OF_A_FOLLOWING_CHANNEL_PARAMETER_BLOCK, "8"
  DIAGNOSTICS_MISSING_SUPPLY_VOLTAGE_L, "1"\n`;
  const staticEndString = `
  DIAGNOSTICS_SHORT_CIRCUIT, AO , 0, "1"
  DIAGNOSTICS_SHORT_CIRCUIT, AO , 1, "1"
  DIAGNOSTICS_SHORT_CIRCUIT, AO , 2, "1"
  DIAGNOSTICS_SHORT_CIRCUIT, AO , 3, "1"
  DIAGNOSTICS_SHORT_CIRCUIT, AO , 4, "1"
  DIAGNOSTICS_SHORT_CIRCUIT, AO , 5, "1"
  DIAGNOSTICS_SHORT_CIRCUIT, AO , 6, "1"
  DIAGNOSTICS_SHORT_CIRCUIT, AO , 7, "1"
  DIAGNOSTICS_WIRE_BREAK, AO , 0, "1"
  DIAGNOSTICS_WIRE_BREAK, AO , 1, "1"
  DIAGNOSTICS_WIRE_BREAK, AO , 2, "1"
  DIAGNOSTICS_WIRE_BREAK, AO , 3, "1"
  DIAGNOSTICS_WIRE_BREAK, AO , 4, "1"
  DIAGNOSTICS_WIRE_BREAK, AO , 5, "1"
  DIAGNOSTICS_WIRE_BREAK, AO , 6, "1"
  DIAGNOSTICS_WIRE_BREAK, AO , 7, "1"
  DIAGNOSTICS_UNDERFLOW, AO , 0, "1"
  DIAGNOSTICS_UNDERFLOW, AO , 1, "1"
  DIAGNOSTICS_UNDERFLOW, AO , 2, "1"
  DIAGNOSTICS_UNDERFLOW, AO , 3, "1"
  DIAGNOSTICS_UNDERFLOW, AO , 4, "1"
  DIAGNOSTICS_UNDERFLOW, AO , 5, "1"
  DIAGNOSTICS_UNDERFLOW, AO , 6, "1"
  DIAGNOSTICS_UNDERFLOW, AO , 7, "1"
  DIAGNOSTICS_OVERFLOW, AO , 0, "1"
  DIAGNOSTICS_OVERFLOW, AO , 1, "1"
  DIAGNOSTICS_OVERFLOW, AO , 2, "1"
  DIAGNOSTICS_OVERFLOW, AO , 3, "1"
  DIAGNOSTICS_OVERFLOW, AO , 4, "1"
  DIAGNOSTICS_OVERFLOW, AO , 5, "1"
  DIAGNOSTICS_OVERFLOW, AO , 6, "1"
  DIAGNOSTICS_OVERFLOW, AO , 7, "1"
  DIAGNOSTICS_HART, AO , 0, "1"
  DIAGNOSTICS_HART, AO , 1, "1"
  DIAGNOSTICS_HART, AO , 2, "1"
  DIAGNOSTICS_HART, AO , 3, "1"
  DIAGNOSTICS_HART, AO , 4, "1"
  DIAGNOSTICS_HART, AO , 5, "1"
  DIAGNOSTICS_HART, AO , 6, "1"
  DIAGNOSTICS_HART, AO , 7, "1"
  REACTION_TO_CPU_STOP, AO , 0, "OUTPUTS_WITHOUT_VOLTAGE_OR_CURRENT"
  REACTION_TO_CPU_STOP, AO , 1, "OUTPUTS_WITHOUT_VOLTAGE_OR_CURRENT"
  REACTION_TO_CPU_STOP, AO , 2, "OUTPUTS_WITHOUT_VOLTAGE_OR_CURRENT"
  REACTION_TO_CPU_STOP, AO , 3, "OUTPUTS_WITHOUT_VOLTAGE_OR_CURRENT"
  REACTION_TO_CPU_STOP, AO , 4, "OUTPUTS_WITHOUT_VOLTAGE_OR_CURRENT"
  REACTION_TO_CPU_STOP, AO , 5, "OUTPUTS_WITHOUT_VOLTAGE_OR_CURRENT"
  REACTION_TO_CPU_STOP, AO , 6, "OUTPUTS_WITHOUT_VOLTAGE_OR_CURRENT"
  REACTION_TO_CPU_STOP, AO , 7, "OUTPUTS_WITHOUT_VOLTAGE_OR_CURRENT"
  SUBSTITUTE_VALUE, AO , 0, "4.000"
  SUBSTITUTE_VALUE, AO , 1, "4.000"
  SUBSTITUTE_VALUE, AO , 2, "4.000"
  SUBSTITUTE_VALUE, AO , 3, "4.000"
  SUBSTITUTE_VALUE, AO , 4, "4.000"
  SUBSTITUTE_VALUE, AO , 5, "4.000"
  SUBSTITUTE_VALUE, AO , 6, "4.000"
  SUBSTITUTE_VALUE, AO , 7, "4.000"
  COUNT_OF_HART_RETRIES, AO , 0, "5"
  COUNT_OF_HART_RETRIES, AO , 1, "5"
  COUNT_OF_HART_RETRIES, AO , 2, "5"
  COUNT_OF_HART_RETRIES, AO , 3, "5"
  COUNT_OF_HART_RETRIES, AO , 4, "5"
  COUNT_OF_HART_RETRIES, AO , 5, "5"
  COUNT_OF_HART_RETRIES, AO , 6, "5"
  COUNT_OF_HART_RETRIES, AO , 7, "5"
  HART_VAR_CHANNEL_1, "0"
  HART_VARIABLE_1, "0"
  HART_VAR_CHANNEL_2, "0"
  HART_VARIABLE_2, "0"
  HART_VAR_CHANNEL_3, "0"
  HART_VARIABLE_3, "0"
  HART_VAR_CHANNEL_4, "0"
  HART_VARIABLE_4, "0"
  HART_VAR_CHANNEL_5, "0"
  HART_VARIABLE_5, "0"
  HART_VAR_CHANNEL_6, "0"
  HART_VARIABLE_6, "0"
  HART_VAR_CHANNEL_7, "0"
  HART_VARIABLE_7, "0"
  HART_VAR_CHANNEL_8, "0"
  HART_VARIABLE_8, "0"\n`;

  let dynamicString = "";
  channels.forEach((channel, index) => {
    dynamicString += `  TYPE_OF_OUTPUT, AO , ${index}, "${
      channel.spare ? "DEACTIVATED" : "CURRENT"
    }"\n`;
  });
  channels.forEach((channel, index) => {
    dynamicString += `  OUTPUT_RANGE, AO , ${index}, "${
      channel.spare ? "NONE" : "4_TO_20_MA_HART"
    }"\n`;
  });

  return staticBeginString + dynamicString + staticEndString;
}

export function buildDI8Diagnostics(channels: Channel[]): string {
  const staticString = `PARAMETER 
  VERSION_LOW, "0"
  VERSION_HIGH, "0"
  CONSTANT, "1"
  NUMBER_OF_FOLLOWING_PARAMETER_STRUCTURES, "2"
  NUMBER_OF_A_FOLLOWING_MODULE_PARAMETER_BLOCK, "1"
  LENGTH_OF_A_FOLLOWING_MODULE_PARAMETER_BLOCK, "6"
  DIAGNOSTICS_MISSING_SUPPLY_VOLTAGE, "1"
  REDUNDANCY_SETTINGS, "0"
  NUMBER_OF_A_FOLLOWING_CHANNEL_PARAMETER_BLOCK, "8"
  LENGTH_OF_A_FOLLOWING_CHANNEL_PARAMETER_BLOCK, "2"
  CHECK_FOR_WIREBREAK, DI , 0, "0"
  CHECK_FOR_WIREBREAK, DI , 1, "0"
  CHECK_FOR_WIREBREAK, DI , 2, "0"
  CHECK_FOR_WIREBREAK, DI , 3, "0"
  CHECK_FOR_WIREBREAK, DI , 4, "0"
  CHECK_FOR_WIREBREAK, DI , 5, "0"
  CHECK_FOR_WIREBREAK, DI , 6, "0"
  CHECK_FOR_WIREBREAK, DI , 7, "0"
  DIAGNOSTICS_WIRE_BREAK, DI , 0, "0"
  DIAGNOSTICS_WIRE_BREAK, DI , 1, "0"
  DIAGNOSTICS_WIRE_BREAK, DI , 2, "0"
  DIAGNOSTICS_WIRE_BREAK, DI , 3, "0"
  DIAGNOSTICS_WIRE_BREAK, DI , 4, "0"
  DIAGNOSTICS_WIRE_BREAK, DI , 5, "0"
  DIAGNOSTICS_WIRE_BREAK, DI , 6, "0"
  DIAGNOSTICS_WIRE_BREAK, DI , 7, "0"
  INPUT_DELAY, DI , 0, "3.2_MS"
  INPUT_DELAY, DI , 1, "3.2_MS"
  INPUT_DELAY, DI , 2, "3.2_MS"
  INPUT_DELAY, DI , 3, "3.2_MS"
  INPUT_DELAY, DI , 4, "3.2_MS"
  INPUT_DELAY, DI , 5, "3.2_MS"
  INPUT_DELAY, DI , 6, "3.2_MS"
  INPUT_DELAY, DI , 7, "3.2_MS"
  HARDWARE_INTERRUPT_ON_RISING_EDGE, DI , 0, "0"
  HARDWARE_INTERRUPT_ON_RISING_EDGE, DI , 1, "0"
  HARDWARE_INTERRUPT_ON_RISING_EDGE, DI , 2, "0"
  HARDWARE_INTERRUPT_ON_RISING_EDGE, DI , 3, "0"
  HARDWARE_INTERRUPT_ON_RISING_EDGE, DI , 4, "0"
  HARDWARE_INTERRUPT_ON_RISING_EDGE, DI , 5, "0"
  HARDWARE_INTERRUPT_ON_RISING_EDGE, DI , 6, "0"
  HARDWARE_INTERRUPT_ON_RISING_EDGE, DI , 7, "0"
  HARDWARE_INTERRUPT_ON_FALLING_EDGE, DI , 0, "0"
  HARDWARE_INTERRUPT_ON_FALLING_EDGE, DI , 1, "0"
  HARDWARE_INTERRUPT_ON_FALLING_EDGE, DI , 2, "0"
  HARDWARE_INTERRUPT_ON_FALLING_EDGE, DI , 3, "0"
  HARDWARE_INTERRUPT_ON_FALLING_EDGE, DI , 4, "0"
  HARDWARE_INTERRUPT_ON_FALLING_EDGE, DI , 5, "0"
  HARDWARE_INTERRUPT_ON_FALLING_EDGE, DI , 6, "0"
  HARDWARE_INTERRUPT_ON_FALLING_EDGE, DI , 7, "0"\n`;

  let dynamicString = "";
  channels.forEach((channel, index) => {
    dynamicString += `  CHANNEL_ACTIVATED, DI , ${index}, "${+(channel.spare =
      !channel.spare)}"\n`;
  });

  return staticString + dynamicString;
}

export function buildDI16Diagnostics(channels: Channel[]): string {
  const staticString = `PARAMETER 
  VERSION_HIGH, "0"
  VERSION_LOW, "0"
  CONSTANT, "1"
  NUMBER_OF_FOLLOWING_PARAMETER_STRUCTURES, "2"
  NUMBER_OF_A_FOLLOWING_MODULE_PARAMETER_BLOCK, "1"
  LENGTH_OF_A_FOLLOWING_MODULE_PARAMETER_BLOCK, "6"
  DIAGNOSTICS_MISSING_SUPPLY_VOLTAGE_L, "1"
  REDUNDANCY_SETTINGS, "0"
  MY_LADDR_HIGH, "0"
  MY_LADDR_LOW, "0"
  RED_LADDR_HIGH, "0"
  RED_LADDR_LOW, "0"
  NUMBER_OF_A_FOLLOWING_CHANNEL_PARAMETER_BLOCK, "16"
  LENGTH_OF_A_FOLLOWING_CHANNEL_PARAMETER_BLOCK, "4"
  CHECK_FOR_WIREBREAK, DI , 0, "0"
  CHECK_FOR_WIREBREAK, DI , 1, "0"
  CHECK_FOR_WIREBREAK, DI , 2, "0"
  CHECK_FOR_WIREBREAK, DI , 3, "0"
  CHECK_FOR_WIREBREAK, DI , 4, "0"
  CHECK_FOR_WIREBREAK, DI , 5, "0"
  CHECK_FOR_WIREBREAK, DI , 6, "0"
  CHECK_FOR_WIREBREAK, DI , 7, "0"
  CHECK_FOR_WIREBREAK, DI , 8, "0"
  CHECK_FOR_WIREBREAK, DI , 9, "0"
  CHECK_FOR_WIREBREAK, DI , 10, "0"
  CHECK_FOR_WIREBREAK, DI , 11, "0"
  CHECK_FOR_WIREBREAK, DI , 12, "0"
  CHECK_FOR_WIREBREAK, DI , 13, "0"
  CHECK_FOR_WIREBREAK, DI , 14, "0"
  CHECK_FOR_WIREBREAK, DI , 15, "0"
  DIAGNOSTICS_SHORT_CIRCUIT_TO_GROUND, DI , 0, "0"
  DIAGNOSTICS_SHORT_CIRCUIT_TO_GROUND, DI , 1, "0"
  DIAGNOSTICS_SHORT_CIRCUIT_TO_GROUND, DI , 2, "0"
  DIAGNOSTICS_SHORT_CIRCUIT_TO_GROUND, DI , 3, "0"
  DIAGNOSTICS_SHORT_CIRCUIT_TO_GROUND, DI , 4, "0"
  DIAGNOSTICS_SHORT_CIRCUIT_TO_GROUND, DI , 5, "0"
  DIAGNOSTICS_SHORT_CIRCUIT_TO_GROUND, DI , 6, "0"
  DIAGNOSTICS_SHORT_CIRCUIT_TO_GROUND, DI , 7, "0"
  DIAGNOSTICS_SHORT_CIRCUIT_TO_GROUND, DI , 8, "0"
  DIAGNOSTICS_SHORT_CIRCUIT_TO_GROUND, DI , 9, "0"
  DIAGNOSTICS_SHORT_CIRCUIT_TO_GROUND, DI , 10, "0"
  DIAGNOSTICS_SHORT_CIRCUIT_TO_GROUND, DI , 11, "0"
  DIAGNOSTICS_SHORT_CIRCUIT_TO_GROUND, DI , 12, "0"
  DIAGNOSTICS_SHORT_CIRCUIT_TO_GROUND, DI , 13, "0"
  DIAGNOSTICS_SHORT_CIRCUIT_TO_GROUND, DI , 14, "0"
  DIAGNOSTICS_SHORT_CIRCUIT_TO_GROUND, DI , 15, "0"
  DIAGNOSTICS_WIRE_BREAK, DI , 0, "0"
  DIAGNOSTICS_WIRE_BREAK, DI , 1, "0"
  DIAGNOSTICS_WIRE_BREAK, DI , 2, "0"
  DIAGNOSTICS_WIRE_BREAK, DI , 3, "0"
  DIAGNOSTICS_WIRE_BREAK, DI , 4, "0"
  DIAGNOSTICS_WIRE_BREAK, DI , 5, "0"
  DIAGNOSTICS_WIRE_BREAK, DI , 6, "0"
  DIAGNOSTICS_WIRE_BREAK, DI , 7, "0"
  DIAGNOSTICS_WIRE_BREAK, DI , 8, "0"
  DIAGNOSTICS_WIRE_BREAK, DI , 9, "0"
  DIAGNOSTICS_WIRE_BREAK, DI , 10, "0"
  DIAGNOSTICS_WIRE_BREAK, DI , 11, "0"
  DIAGNOSTICS_WIRE_BREAK, DI , 12, "0"
  DIAGNOSTICS_WIRE_BREAK, DI , 13, "0"
  DIAGNOSTICS_WIRE_BREAK, DI , 14, "0"
  DIAGNOSTICS_WIRE_BREAK, DI , 15, "0"
  INPUT_DELAY, DI , 0, "3.2_MS"
  INPUT_DELAY, DI , 1, "3.2_MS"
  INPUT_DELAY, DI , 2, "3.2_MS"
  INPUT_DELAY, DI , 3, "3.2_MS"
  INPUT_DELAY, DI , 4, "3.2_MS"
  INPUT_DELAY, DI , 5, "3.2_MS"
  INPUT_DELAY, DI , 6, "3.2_MS"
  INPUT_DELAY, DI , 7, "3.2_MS"
  INPUT_DELAY, DI , 8, "3.2_MS"
  INPUT_DELAY, DI , 9, "3.2_MS"
  INPUT_DELAY, DI , 10, "3.2_MS"
  INPUT_DELAY, DI , 11, "3.2_MS"
  INPUT_DELAY, DI , 12, "3.2_MS"
  INPUT_DELAY, DI , 13, "3.2_MS"
  INPUT_DELAY, DI , 14, "3.2_MS"
  INPUT_DELAY, DI , 15, "3.2_MS"
  HARDWARE_INTERRUPT_ON_RISING_EDGE, DI , 0, "0"
  HARDWARE_INTERRUPT_ON_RISING_EDGE, DI , 1, "0"
  HARDWARE_INTERRUPT_ON_RISING_EDGE, DI , 2, "0"
  HARDWARE_INTERRUPT_ON_RISING_EDGE, DI , 3, "0"
  HARDWARE_INTERRUPT_ON_RISING_EDGE, DI , 4, "0"
  HARDWARE_INTERRUPT_ON_RISING_EDGE, DI , 5, "0"
  HARDWARE_INTERRUPT_ON_RISING_EDGE, DI , 6, "0"
  HARDWARE_INTERRUPT_ON_RISING_EDGE, DI , 7, "0"
  HARDWARE_INTERRUPT_ON_RISING_EDGE, DI , 8, "0"
  HARDWARE_INTERRUPT_ON_RISING_EDGE, DI , 9, "0"
  HARDWARE_INTERRUPT_ON_RISING_EDGE, DI , 10, "0"
  HARDWARE_INTERRUPT_ON_RISING_EDGE, DI , 11, "0"
  HARDWARE_INTERRUPT_ON_RISING_EDGE, DI , 12, "0"
  HARDWARE_INTERRUPT_ON_RISING_EDGE, DI , 13, "0"
  HARDWARE_INTERRUPT_ON_RISING_EDGE, DI , 14, "0"
  HARDWARE_INTERRUPT_ON_RISING_EDGE, DI , 15, "0"
  HARDWARE_INTERRUPT_ON_FALLING_EDGE, DI , 0, "0"
  HARDWARE_INTERRUPT_ON_FALLING_EDGE, DI , 1, "0"
  HARDWARE_INTERRUPT_ON_FALLING_EDGE, DI , 2, "0"
  HARDWARE_INTERRUPT_ON_FALLING_EDGE, DI , 3, "0"
  HARDWARE_INTERRUPT_ON_FALLING_EDGE, DI , 4, "0"
  HARDWARE_INTERRUPT_ON_FALLING_EDGE, DI , 5, "0"
  HARDWARE_INTERRUPT_ON_FALLING_EDGE, DI , 6, "0"
  HARDWARE_INTERRUPT_ON_FALLING_EDGE, DI , 7, "0"
  HARDWARE_INTERRUPT_ON_FALLING_EDGE, DI , 8, "0"
  HARDWARE_INTERRUPT_ON_FALLING_EDGE, DI , 9, "0"
  HARDWARE_INTERRUPT_ON_FALLING_EDGE, DI , 10, "0"
  HARDWARE_INTERRUPT_ON_FALLING_EDGE, DI , 11, "0"
  HARDWARE_INTERRUPT_ON_FALLING_EDGE, DI , 12, "0"
  HARDWARE_INTERRUPT_ON_FALLING_EDGE, DI , 13, "0"
  HARDWARE_INTERRUPT_ON_FALLING_EDGE, DI , 14, "0"
  HARDWARE_INTERRUPT_ON_FALLING_EDGE, DI , 15, "0"
  PULSE_EXTENSION, DI , 0, "OFF"
  PULSE_EXTENSION, DI , 1, "OFF"
  PULSE_EXTENSION, DI , 2, "OFF"
  PULSE_EXTENSION, DI , 3, "OFF"
  PULSE_EXTENSION, DI , 4, "OFF"
  PULSE_EXTENSION, DI , 5, "OFF"
  PULSE_EXTENSION, DI , 6, "OFF"
  PULSE_EXTENSION, DI , 7, "OFF"
  PULSE_EXTENSION, DI , 8, "OFF"
  PULSE_EXTENSION, DI , 9, "OFF"
  PULSE_EXTENSION, DI , 10, "OFF"
  PULSE_EXTENSION, DI , 11, "OFF"
  PULSE_EXTENSION, DI , 12, "OFF"
  PULSE_EXTENSION, DI , 13, "OFF"
  PULSE_EXTENSION, DI , 14, "OFF"
  PULSE_EXTENSION, DI , 15, "OFF"\n`;

  let dynamicString = "";
  channels.forEach((channel, index) => {
    dynamicString += `  CHANNEL_ACTIVATED, DI , ${index}, "${+(channel.spare =
      !channel.spare)}"\n`;
  });

  return staticString + dynamicString;
}

export function buildDODiagnostics(channels: Channel[]): string {
  const staticBeginString = `PARAMETER 
  VERSION_LOW, "0"
  VERSION_HIGH, "0"
  CONSTANT, "1"
  NUMBER_OF_FOLLOWING_PARAMETER_STRUCTURES, "2"
  NUMBER_OF_A_FOLLOWING_MODULE_PARAMETER_BLOCK, "1"
  LENGTH_OF_A_FOLLOWING_MODULE_PARAMETER_BLOCK, "6"
  DIAGNOSTICS_MISSING_SUPPLY_VOLTAGE, "1"
  REDUNDANCY_SETTINGS, "0"
  MY_LADDR_HIGH, "0"
  MY_LADDR_LOW, "0"
  RED_LADDR_HIGH, "0"
  RED_LADDR_LOW, "0"
  NUMBER_OF_A_FOLLOWING_CHANNEL_PARAMETER_BLOCK, "16"
  LENGTH_OF_A_FOLLOWING_CHANNEL_PARAMETER_BLOCK, "2"
  WIRE_BREAK_TEST, DO , 0, "1"
  WIRE_BREAK_TEST, DO , 1, "1"
  WIRE_BREAK_TEST, DO , 2, "1"
  WIRE_BREAK_TEST, DO , 3, "1"
  WIRE_BREAK_TEST, DO , 4, "1"
  WIRE_BREAK_TEST, DO , 5, "1"
  WIRE_BREAK_TEST, DO , 6, "1"
  WIRE_BREAK_TEST, DO , 7, "1"
  WIRE_BREAK_TEST, DO , 8, "1"
  WIRE_BREAK_TEST, DO , 9, "1"
  WIRE_BREAK_TEST, DO , 10, "1"
  WIRE_BREAK_TEST, DO , 11, "1"
  WIRE_BREAK_TEST, DO , 12, "1"
  WIRE_BREAK_TEST, DO , 13, "1"
  WIRE_BREAK_TEST, DO , 14, "1"
  WIRE_BREAK_TEST, DO , 15, "1"
  DIAGNOSTICS_SHORT_CIRCUIT_TO_GROUND, DO , 0, "1"
  DIAGNOSTICS_SHORT_CIRCUIT_TO_GROUND, DO , 1, "1"
  DIAGNOSTICS_SHORT_CIRCUIT_TO_GROUND, DO , 2, "1"
  DIAGNOSTICS_SHORT_CIRCUIT_TO_GROUND, DO , 3, "1"
  DIAGNOSTICS_SHORT_CIRCUIT_TO_GROUND, DO , 4, "1"
  DIAGNOSTICS_SHORT_CIRCUIT_TO_GROUND, DO , 5, "1"
  DIAGNOSTICS_SHORT_CIRCUIT_TO_GROUND, DO , 6, "1"
  DIAGNOSTICS_SHORT_CIRCUIT_TO_GROUND, DO , 7, "1"
  DIAGNOSTICS_SHORT_CIRCUIT_TO_GROUND, DO , 8, "1"
  DIAGNOSTICS_SHORT_CIRCUIT_TO_GROUND, DO , 9, "1"
  DIAGNOSTICS_SHORT_CIRCUIT_TO_GROUND, DO , 10, "1"
  DIAGNOSTICS_SHORT_CIRCUIT_TO_GROUND, DO , 11, "1"
  DIAGNOSTICS_SHORT_CIRCUIT_TO_GROUND, DO , 12, "1"
  DIAGNOSTICS_SHORT_CIRCUIT_TO_GROUND, DO , 13, "1"
  DIAGNOSTICS_SHORT_CIRCUIT_TO_GROUND, DO , 14, "1"
  DIAGNOSTICS_SHORT_CIRCUIT_TO_GROUND, DO , 15, "1"
  DIAGNOSTICS_SHORT_CIRCUIT_TO_L, DO , 0, "1"
  DIAGNOSTICS_SHORT_CIRCUIT_TO_L, DO , 1, "1"
  DIAGNOSTICS_SHORT_CIRCUIT_TO_L, DO , 2, "1"
  DIAGNOSTICS_SHORT_CIRCUIT_TO_L, DO , 3, "1"
  DIAGNOSTICS_SHORT_CIRCUIT_TO_L, DO , 4, "1"
  DIAGNOSTICS_SHORT_CIRCUIT_TO_L, DO , 5, "1"
  DIAGNOSTICS_SHORT_CIRCUIT_TO_L, DO , 6, "1"
  DIAGNOSTICS_SHORT_CIRCUIT_TO_L, DO , 7, "1"
  DIAGNOSTICS_SHORT_CIRCUIT_TO_L, DO , 8, "1"
  DIAGNOSTICS_SHORT_CIRCUIT_TO_L, DO , 9, "1"
  DIAGNOSTICS_SHORT_CIRCUIT_TO_L, DO , 10, "1"
  DIAGNOSTICS_SHORT_CIRCUIT_TO_L, DO , 11, "1"
  DIAGNOSTICS_SHORT_CIRCUIT_TO_L, DO , 12, "1"
  DIAGNOSTICS_SHORT_CIRCUIT_TO_L, DO , 13, "1"
  DIAGNOSTICS_SHORT_CIRCUIT_TO_L, DO , 14, "1"
  DIAGNOSTICS_SHORT_CIRCUIT_TO_L, DO , 15, "1"
  DIAGNOSTICS_WIRE_BREAK, DO , 0, "1"
  DIAGNOSTICS_WIRE_BREAK, DO , 1, "1"
  DIAGNOSTICS_WIRE_BREAK, DO , 2, "1"
  DIAGNOSTICS_WIRE_BREAK, DO , 3, "1"
  DIAGNOSTICS_WIRE_BREAK, DO , 4, "1"
  DIAGNOSTICS_WIRE_BREAK, DO , 5, "1"
  DIAGNOSTICS_WIRE_BREAK, DO , 6, "1"
  DIAGNOSTICS_WIRE_BREAK, DO , 7, "1"
  DIAGNOSTICS_WIRE_BREAK, DO , 8, "1"
  DIAGNOSTICS_WIRE_BREAK, DO , 9, "1"
  DIAGNOSTICS_WIRE_BREAK, DO , 10, "1"
  DIAGNOSTICS_WIRE_BREAK, DO , 11, "1"
  DIAGNOSTICS_WIRE_BREAK, DO , 12, "1"
  DIAGNOSTICS_WIRE_BREAK, DO , 13, "1"
  DIAGNOSTICS_WIRE_BREAK, DO , 14, "1"
  DIAGNOSTICS_WIRE_BREAK, DO , 15, "1"\n`;

  const staticEndString = `  REACTION_TO_CPU_STOP, DO , 0, "TURN_OFF"
  REACTION_TO_CPU_STOP, DO , 1, "TURN_OFF"
  REACTION_TO_CPU_STOP, DO , 2, "TURN_OFF"
  REACTION_TO_CPU_STOP, DO , 3, "TURN_OFF"
  REACTION_TO_CPU_STOP, DO , 4, "TURN_OFF"
  REACTION_TO_CPU_STOP, DO , 5, "TURN_OFF"
  REACTION_TO_CPU_STOP, DO , 6, "TURN_OFF"
  REACTION_TO_CPU_STOP, DO , 7, "TURN_OFF"
  REACTION_TO_CPU_STOP, DO , 8, "TURN_OFF"
  REACTION_TO_CPU_STOP, DO , 9, "TURN_OFF"
  REACTION_TO_CPU_STOP, DO , 10, "TURN_OFF"
  REACTION_TO_CPU_STOP, DO , 11, "TURN_OFF"
  REACTION_TO_CPU_STOP, DO , 12, "TURN_OFF"
  REACTION_TO_CPU_STOP, DO , 13, "TURN_OFF"
  REACTION_TO_CPU_STOP, DO , 14, "TURN_OFF"
  REACTION_TO_CPU_STOP, DO , 15, "TURN_OFF"
  SUBSTITUTE_VALUE, DO , 0, "0"
  SUBSTITUTE_VALUE, DO , 1, "0"
  SUBSTITUTE_VALUE, DO , 2, "0"
  SUBSTITUTE_VALUE, DO , 3, "0"
  SUBSTITUTE_VALUE, DO , 4, "0"
  SUBSTITUTE_VALUE, DO , 5, "0"
  SUBSTITUTE_VALUE, DO , 6, "0"
  SUBSTITUTE_VALUE, DO , 7, "0"
  SUBSTITUTE_VALUE, DO , 8, "0"
  SUBSTITUTE_VALUE, DO , 9, "0"
  SUBSTITUTE_VALUE, DO , 10, "0"
  SUBSTITUTE_VALUE, DO , 11, "0"
  SUBSTITUTE_VALUE, DO , 12, "0"
  SUBSTITUTE_VALUE, DO , 13, "0"
  SUBSTITUTE_VALUE, DO , 14, "0"
  SUBSTITUTE_VALUE, DO , 15, "0"\n`;

  let dynamicString = "";
  channels.forEach((channel, index) => {
    dynamicString += `  CHANNEL_ACTIVATED, DO , ${index}, "${+(channel.spare =
      !channel.spare)}"\n`;
  });

  return staticBeginString + dynamicString + staticEndString;
}
