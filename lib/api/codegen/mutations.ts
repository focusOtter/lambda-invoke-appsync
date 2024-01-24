/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

import * as APITypes from "./API";
type GeneratedMutation<InputType, OutputType> = string & {
  __generatedMutationInput: InputType;
  __generatedMutationOutput: OutputType;
};

export const broadcastMessage = /* GraphQL */ `mutation BroadcastMessage($msg: String) {
  broadcastMessage(msg: $msg)
}
` as GeneratedMutation<
  APITypes.BroadcastMessageMutationVariables,
  APITypes.BroadcastMessageMutation
>;
