mod timer;

use timer::{TimerManager, TimerState};
use tauri::{Manager, State};

struct AppState {
    timer_manager: TimerManager,
}

#[tauri::command]
fn timer_get_state(state: State<AppState>) -> Result<TimerState, String> {
    Ok(state.timer_manager.get_state())
}

#[tauri::command]
fn timer_set_duration(minutes: u32, state: State<AppState>) -> Result<TimerState, String> {
    state.timer_manager.set_duration(minutes)
}

#[tauri::command]
fn timer_start(state: State<AppState>) -> Result<TimerState, String> {
    state.timer_manager.start()
}

#[tauri::command]
fn timer_pause(state: State<AppState>) -> Result<TimerState, String> {
    Ok(state.timer_manager.pause())
}

#[tauri::command]
fn timer_reset(state: State<AppState>) -> Result<TimerState, String> {
    Ok(state.timer_manager.reset())
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
  tauri::Builder::default()
    .setup(|app| {
      if cfg!(debug_assertions) {
        app.handle().plugin(
          tauri_plugin_log::Builder::default()
            .level(log::LevelFilter::Info)
            .build(),
        )?;
      }

      // Initialize timer manager with tokio runtime
      let timer_manager = TimerManager::new(app.handle().clone());
      
      app.manage(AppState {
        timer_manager,
      });

      Ok(())
    })
    .invoke_handler(tauri::generate_handler![
      timer_get_state,
      timer_set_duration,
      timer_start,
      timer_pause,
      timer_reset
    ])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
