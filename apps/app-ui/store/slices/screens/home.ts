import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { globalReset } from '../../global.actions';
import { uploadFile } from '../../actions/entries';

export interface SelectedFile {
  name: string;
  url: string;
  identifier: string;
  type: string;
  bytes: number;
  uploadProgress: number;
}

interface QueuedFile extends SelectedFile {
  key: string;
}

export interface HomeScreenState {
  // Attachments
  filesSelected: string[];
  pendingFilesForEntry: SelectedFile[];
  queuedFilesForEntry: QueuedFile[];
}

const initialState: HomeScreenState = {
  filesSelected: [],
  pendingFilesForEntry: [],
  queuedFilesForEntry: [],
};

export const homeScreenSlice = createSlice({
  name: 'home-screen',
  initialState,
  reducers: {
    resetState: () => {
      return {
        ...initialState,
      };
    },
    resetSelectedFiles: (state) => {
      state.pendingFilesForEntry = [];
      state.queuedFilesForEntry = [];
      state.filesSelected = [];
    },
    removeFile: (state, action: PayloadAction<string>) => {
      state.pendingFilesForEntry = [...state.pendingFilesForEntry].filter(
        (pf) => pf.identifier !== action.payload,
      );
      state.queuedFilesForEntry = [...state.queuedFilesForEntry].filter(
        (pf) => pf.identifier !== action.payload,
      );
      state.filesSelected = [...state.filesSelected].filter(
        (identifier) => identifier !== action.payload,
      );
    },
    updateFileUploadProgress: (state, action: PayloadAction<[string, number]>) => {
      state.pendingFilesForEntry = state.pendingFilesForEntry.map((pfe) => ({
        ...pfe,
        uploadProgress:
          pfe.name === action.payload[0] ? action.payload[1] : pfe.uploadProgress,
      }));
    },
  },
  extraReducers: (builder) => {
    builder.addCase(uploadFile.pending, (state, action) => {
      const identifier = toIdentifier(action.meta.arg.file);
      if (!state.filesSelected.includes(identifier)) {
        state.pendingFilesForEntry = [
          ...state.pendingFilesForEntry,
          {
            name: action.meta.arg.file.name,
            identifier,
            url: action.meta.arg.url,
            type: action.meta.arg.file.type,
            uploadProgress: 0,
            bytes: action.meta.arg.file.size,
          },
        ];
        state.filesSelected = [...state.filesSelected, identifier];
      }
    });
    builder.addCase(uploadFile.fulfilled, (state, action) => {
      const identifier = toIdentifier(action.meta.arg.file);
      if (state.filesSelected.includes(identifier)) {
        const name = action.meta.arg.file.name;
        state.pendingFilesForEntry = [...state.pendingFilesForEntry].filter(
          (pf) => pf.name !== name,
        );
        state.queuedFilesForEntry = [
          ...state.queuedFilesForEntry,
          {
            key: action.payload.key,
            name: action.meta.arg.file.name,
            url: action.meta.arg.url,
            identifier,
            type: action.meta.arg.file.type,
            uploadProgress: 1,
            bytes: action.meta.arg.file.size,
          },
        ];
      }
    });

    builder.addCase(globalReset, () => {
      return {
        ...initialState,
      };
    });
  },
});

export const { resetState, resetSelectedFiles, removeFile, updateFileUploadProgress } =
  homeScreenSlice.actions;

export default homeScreenSlice.reducer;

const toIdentifier = (file: File) => `${file.name}:${file.size}`;
