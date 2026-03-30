use std::sync::{Arc, Mutex};
use tauri::{AppHandle, Emitter};
use serde::{Deserialize, Serialize};
use tokio::time::{sleep, Duration};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct TimerState {
    pub total_seconds: u32,
    pub remaining_seconds: u32,
    pub is_running: bool,
    pub end_time: Option<u64>, // Unix timestamp in milliseconds
}

impl Default for TimerState {
    fn default() -> Self {
        Self {
            total_seconds: 0,
            remaining_seconds: 0,
            is_running: false,
            end_time: None,
        }
    }
}

pub struct TimerManager {
    state: Arc<Mutex<TimerState>>,
}

impl TimerManager {
    pub fn new(app_handle: AppHandle) -> Self {
        let manager = Self {
            state: Arc::new(Mutex::new(TimerState::default())),
        };

        // Start background task
        manager.start_background_task(app_handle);
        
        manager
    }

    fn start_background_task(&self, app_handle: AppHandle) {
        let state = Arc::clone(&self.state);

        // Use tauri::async_runtime to spawn the task
        tauri::async_runtime::spawn(async move {
            loop {
                // Check every second - optimal for countdown timers
                sleep(Duration::from_secs(1)).await;

                let mut state_guard = state.lock().unwrap();
                
                if !state_guard.is_running {
                    continue;
                }

                if let Some(end_time) = state_guard.end_time {
                    let now = std::time::SystemTime::now()
                        .duration_since(std::time::UNIX_EPOCH)
                        .unwrap()
                        .as_millis() as u64;

                    if now >= end_time {
                        // Timer finished
                        state_guard.remaining_seconds = 0;
                        state_guard.is_running = false;
                        state_guard.end_time = None;

                        // Emit event to frontend
                        let _ = app_handle.emit("timer-finished", ());
                        
                        log::info!("Timer finished!");
                    } else {
                        // Update remaining seconds
                        let remaining_ms = end_time - now;
                        state_guard.remaining_seconds = ((remaining_ms + 999) / 1000) as u32;
                    }

                    // Emit update event
                    let _ = app_handle.emit("timer-tick", state_guard.clone());
                }
            }
        });
    }

    pub fn get_state(&self) -> TimerState {
        self.state.lock().unwrap().clone()
    }

    pub fn set_duration(&self, minutes: u32) -> Result<TimerState, String> {
        let mut state = self.state.lock().unwrap();
        
        if state.is_running {
            return Err("Cannot set duration while timer is running".to_string());
        }

        let seconds = minutes * 60;
        state.total_seconds = seconds;
        state.remaining_seconds = seconds;
        
        Ok(state.clone())
    }

    pub fn start(&self) -> Result<TimerState, String> {
        let mut state = self.state.lock().unwrap();
        
        if state.remaining_seconds == 0 {
            return Err("Cannot start timer with 0 seconds".to_string());
        }

        state.is_running = true;
        
        // Calculate end time
        let now = std::time::SystemTime::now()
            .duration_since(std::time::UNIX_EPOCH)
            .unwrap()
            .as_millis() as u64;
        
        state.end_time = Some(now + (state.remaining_seconds as u64 * 1000));
        
        log::info!("Timer started: {} seconds", state.remaining_seconds);
        
        Ok(state.clone())
    }

    pub fn pause(&self) -> TimerState {
        let mut state = self.state.lock().unwrap();
        state.is_running = false;
        state.end_time = None;
        
        log::info!("Timer paused: {} seconds remaining", state.remaining_seconds);
        
        state.clone()
    }

    pub fn reset(&self) -> TimerState {
        let mut state = self.state.lock().unwrap();
        state.is_running = false;
        state.end_time = None;
        state.remaining_seconds = state.total_seconds;
        
        log::info!("Timer reset to {} seconds", state.total_seconds);
        
        state.clone()
    }
}
