export default {
  'A' = {
    name: 'Open',
    description: 'Set the note of the line to A',
  },
  'B' = {
    name: 'Open',
    description: 'Set the note of the line to B',
  },
  'C' = {
    name: 'Open',
    description: 'Set the note of the line to C',
  },
  'D' = {
    name: 'Open',
    description: 'Set the note of the line to D',
  },
  'E' = {
    name: 'Open',
    description: 'Set the note of the line to E',
  },
  'F' = {
    name: 'Open',
    description: 'Set the note of the line to F',
  },
  'G' = {
    name: 'Open',
    description: 'Set the note of the line to G',
  },
  'H' = {
    name: 'Halt',
    description: 'Pause the song, but allow it to restart from this point',
  },
  'I' = {
    name: 'Instrument',
    description: 'Set the intrument to that defined by the following number',
  },
  'J' = {
    name: 'Jump',
    description: 'Jump along the current line',
  },
  'K' = {
    name: 'Kill',
    description: 'Remove the cursor',
  },
  'L' = {
    name: 'Line',
    description: 'Go to a different line',
  },
  'M' = {
    name: 'Move',
    description: 'Move up for down by an amount of lines',
  },
  'N' = {
    name: 'Negate',
    description: 'Negate the next command',
  },
  'O' = {
  },
  'P' = {
  },
  'Q' = {
    name: 'Quit',
    description: 'End the song',
  },
  'R' = {
    name: 'Replicate',
    description: 'Make a copy of the cursor which ignores the next instruction',
  },
  'S' = {
    name: 'Send',
    description: 'Send a copy of the cursor to another line',
  },
  'T' = {
    name: 'Transpose',
    description: 'Change the open note',
  },
  'U' = {
    name: 'Undo',
    description: 'Undo the last command on this line',
  },
  'V' = {
    name: 'Velocity',
    description: 'Set the velocity for this string',
  },
  'W' = {
    name: 'Meta',
    description: 'Alter the function of the next command',
  },
  'X' = {
    name: 'Meta',
    description: 'Alter the function of the next command',
  },
  'Y' = {
    name: 'Meta',
    description: 'Alter the function of the next command',
  },
  'Z' = {
    name: 'Meta',
    description: 'Alter the function of the next command',
  },

}

/*
ABCDEFGHIJK
LM
NOPQ
RS
TUVWXYZ

L = Less
M = More,
I = Instrument, Into
V = Volume, Velocity, Vary
T = Transpose, Type, Tone, Tune, Twin
S = Send, Same, Skip, Swap, Sync
R = Replicate, Read, Rate, Rest
p = Poly, Push, Pull, Pipe, Pair, Pace, Part, Pass, Play


Mute, Send,

Move left or Right
Negate

Move to Line, Move by Line
Move to Char, Move by Char

Velocity 0-128 in base 16
Transpose(notes) 0-128 in base 16
Repeat(times)
Instrument(code) 0-128 in base 16
Line(lineNumber)
Repeat(times)

*/