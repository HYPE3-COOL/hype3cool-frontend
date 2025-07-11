import { createSlice } from '@reduxjs/toolkit';
import { AgentCharacter, FullCharacter, StatusType, Twitter } from '@/types/types';
import { EmptyCharacter } from '@/constants/constants';

export interface AgentStateProps {
    createAgentStep: number;
    suggestedTwitters: Twitter[];
    profilePic: string;
    sampleTweets: string[];
    agentCharacter: AgentCharacter;
    isAnalyzeLoading: StatusType;
    isBreedLoading: StatusType;
    isGenerateCharacterAndTweetsStatus: StatusType;
    activeAgentId: string | undefined;
}

const initialState: AgentStateProps = {
    createAgentStep: 1,
    suggestedTwitters: [],
    profilePic: '',
    sampleTweets: [],
    agentCharacter: EmptyCharacter,
    isAnalyzeLoading: 'idle',
    isBreedLoading: 'idle',
    isGenerateCharacterAndTweetsStatus: 'idle',
    activeAgentId: undefined,
};

const slice = createSlice({
    name: 'agent',
    initialState,
    reducers: {
        setCreateAgentStep(state, action) {
            state.createAgentStep = action.payload;
        },

        setSuggestedTwitters(state, action) {
            state.suggestedTwitters = action.payload;
        },

        setProfilePic(state, action) {
            state.profilePic = action.payload;
        },

        setSampleTweets(state, action) {
            state.sampleTweets = action.payload;
        },

        setIsAnalyzeLoading(state, action) {
            state.isAnalyzeLoading = action.payload;
        },

        setIsBreedLoading(state, action) {
            state.isBreedLoading = action.payload;
        },

        setIsGenerateCharacterAndTweetsStatus(state, action) {
            state.isGenerateCharacterAndTweetsStatus = action.payload;
        },

        setAgentCharacter(state, action) {
            state.agentCharacter = action.payload;
        },

        setActiveAgentId(state, action) {
            state.activeAgentId = action.payload;
        },

        resetCreateAgent(state) {
            state = initialState;
        },

        // edit mode
        initialEditAgent(state, action) {
            state.createAgentStep = action.payload.createAgentStep;
            state.suggestedTwitters = action.payload.suggestedTwitters;
            state.profilePic = action.payload.profilePic;
            state.agentCharacter = action.payload.agentCharacter;
            state.activeAgentId = action.payload.activeAgentId;

            state.sampleTweets = [];
            state.isAnalyzeLoading = 'idle';
            state.isBreedLoading = 'idle';
            state.isGenerateCharacterAndTweetsStatus = 'idle';
        },
    },
});

export default slice.reducer;

export const {
    setCreateAgentStep,
    setSuggestedTwitters,
    setProfilePic,
    setSampleTweets,
    setIsAnalyzeLoading,
    setIsBreedLoading,
    setIsGenerateCharacterAndTweetsStatus,
    setAgentCharacter,
    setActiveAgentId,
    resetCreateAgent,
    initialEditAgent,
} = slice.actions;
